import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Router, Request, Response } from "express";
import axios from "axios";
import { OAuth2Client } from "google-auth-library";
import BLToken from "../models/BLTokenModel";
import UserAuth from "../models/userAuthModel";
import UserAuthGoogle from "../models/userAuthGoogleModel";
import UserData, { UserDataType } from "../models/userDataModel";
import Product from "../models/product.model";
import { validationToken } from "../middlewares/middleware";
import dotenv from "dotenv";

dotenv.config();

const router = Router();
const client = new OAuth2Client(
	process.env.GOOGLE_CLIENT_ID,
	process.env.GOOGLE_CLIENT_SECRET,
	process.env.NODE_ENV === "production"
		? `http://localhost:${process.env.PORT}`
		: "http://localhost:5173",
);

function isError(error: any): error is { message: string } {
	return error && typeof error === "object" && "message" in error;
}

router.post(
	"/bind-account",
	validationToken,
	async (req: Request, res: Response) => {
		if (!req.userData) {
			console.log("userData kosong");
			return res.status(401).json({
				msg: "Akses ditolak!",
			});
		}

		const userData = req.userData;
		const { bindWith } = req.body;
		let user;

		try {
			if (userData.loginWith === "google") {
				user = await UserAuthGoogle.findOne({ googleId: userData.id }).populate(
					"userData",
				);
			} else {
				user = await UserAuth.findById(userData.id).populate("userData");
			}

			if (!user) {
				return res.status(404).json({
					msg: "Akun tidak ditemukan!",
				});
			}

			switch (bindWith) {
				case "email": {
					console.log("bind With email");
					const { email, password, username } = req.body;
					const salt = await bcrypt.genSalt(10);

					if (!email || !password) {
						return res.status(403).json({ msg: "lengkapi datanya dulu!" });
					}

					console.log(user);

					const isExistUser = await UserAuth.findOne({
						email,
					});

					if (isExistUser) {
						return res.status(400).json({
							msg: "Akun dengan email " + email + " sudah terdaftar!",
						});
					}

					const hashedPassword = await bcrypt.hash(password, salt);

					const newUserAuth = new UserAuth({
						username: user.username,
						email,
						password: hashedPassword,
						userData: user.userData._id,
					});

					console.log(newUserAuth, user.userData);

					// simpan
					await newUserAuth.save();
					const newUserData = (await UserData.findOneAndUpdate(
						{
							_id: user.userData._id,
						},
						{
							$addToSet: {
								loginWith: {
									type: "email",
									email,
								},
							},
						},
						{
							new: true,
						},
					)) as unknown as UserDataType;
					res.status(200).json({
						msg: "Berhasil mengikat akun dengan email" + email,
						data: {
							username: newUserData.username,
							loginWith: newUserData.loginWith,
						},
					});

					break;
				}
				case "google": {
					console.log("bind with google");
					const { code } = req.body;

					if (!code) {
						return res
							.status(400)
							.json({ msg: "Authorization Code tidak tersedia." });
					}

					const { tokens } = await client.getToken(code);

					// ID Token adalah JWT yang berisi info user yang sudah diverifikasi Google
					const ticket = await client.verifyIdToken({
						idToken: tokens.id_token!,
						audience: process.env.GOOGLE_CLIENT_ID,
					});

					const payload = ticket.getPayload();

					const isUserExist = await UserAuthGoogle.findOne({
						googleId: payload!.sub,
					});

					if (isUserExist) {
						return res.status(409).json({
							msg: "Akun google sudah terdaftar!",
						});
					}

					const newUserGoogle = new UserAuthGoogle({
						googleId: payload!.sub,
						email: payload!.email,
						username: user.username,
						userData: user.userData._id,
					});

					await newUserGoogle.save();
					const newUserData = (await UserData.findOneAndUpdate(
						{
							_id: user.userData._id,
						},
						{
							$addToSet: {
								loginWith: {
									type: "google",
									email: payload!.email,
								},
							},
						},
						{
							new: true,
						},
					)) as unknown as UserDataType;

					console.log(newUserGoogle, user.userData);

					res.status(200).json({
						msg: "Berhasil mengbind akun ke google",
						data: {
							username: newUserData.username,
							loginWith: newUserData.loginWith,
						},
					});

					break;
				}
				default: {
					res.status(400).json({ msg: "Bind method tidak tersedia." });
				}
			}
		} catch (e) {
			if (isError(e)) {
				console.error(`Error message: ${e.message}`);
				res.status(500).json({ success: false, msg: "Server error" });
			}
		}
	},
);

router.post("/google/register", async (req: Request, res: Response) => {
	const { code } = req.body;

	if (!code) {
		return res.status(400).json({ msg: "Authorization Code tidak tersedia." });
	}

	try {
		const { tokens } = await client.getToken(code);

		// ID Token adalah JWT yang berisi info user yang sudah diverifikasi Google
		const ticket = await client.verifyIdToken({
			idToken: tokens.id_token!,
			audience: process.env.GOOGLE_CLIENT_ID,
		});

		const payload = ticket.getPayload();

		// tambahkan kode untuk menambhakan user kedalam userAuthGoogle dan buat userData
		// buat untuk fitur loginnya
		// intinya sama tapi di login cuma ngecek apakah idGoogle pengguna sudah ada atau belum
		const isUserExist = await UserAuthGoogle.findOne({
			googleId: payload!.sub,
		});

		if (isUserExist) {
			return res.status(409).json({
				msg: "Akun google sudah terdaftar!",
			});
		}

		const newUserData = new UserData({
			orderList: [],
			purchaseItems: [],
			userProducts: [],
			username: payload!.name,
			loginWith: [
				{
					type: "google",
					email: payload!.email,
				},
			],
		});

		const newUser = new UserAuthGoogle({
			googleId: payload!.sub,
			email: payload!.email,
			username: payload!.name,
			userData: newUserData._id,
		});

		await Promise.all([newUserData.save(), newUser.save()]);

		const jwtPayload = {
			id: payload!.sub,
			username: payload!.name,
			email: payload!.email,
			accessToken: tokens.access_token,
			loginWith: "google",
		};

		// setelah berhasil register, user otomatis dapat melakukan login
		const appJwtToken = jwt.sign(jwtPayload, process.env.JWT_SECRET!, {
			expiresIn: "1h",
		});

		res.json({
			token: appJwtToken,
			msg: "Registrasi berhasil",
		});
	} catch (error) {
		console.error("Error saat menukar kode atau memverifikasi token:", error);
		res.status(500).json({ msg: "Otentikasi Google gagal." });
	}
});

router.post("/google/login", async (req: Request, res: Response) => {
	// Terima kode otorisasi dari frontend
	const { code } = req.body;

	if (!code) {
		return res.status(400).json({ msg: "Authorization Code tidak tersedia." });
	}

	try {
		// Tukar code
		const { tokens } = await client.getToken(code);

		// Dapatkan Payload (Informasi User) dari ID Token
		// ID Token adalah JWT yang berisi info user yang sudah diverifikasi Google
		const ticket = await client.verifyIdToken({
			idToken: tokens.id_token!,
			audience: process.env.GOOGLE_CLIENT_ID,
		});

		const payload = ticket.getPayload();

		// tambahkan kode untuk menambhakan user kedalam userAuthGoogle dan buat userData
		// buat untuk fitur loginnya
		// intinya sama tapi di login cuma ngecek apakah idGoogle pengguna sudah ada atau belum
		const user = await UserAuthGoogle.findOne({
			googleId: payload!.sub,
		});

		if (!user) {
			return res.status(409).json({
				msg: "Akun tidak ditemukan!",
			});
		}

		const jwtPayload = {
			id: user.googleId,
			username: user.username,
			email: user.email,
			accessToken: tokens.access_token,
			loginWith: "google",
		};

		const appJwtToken = jwt.sign(
			jwtPayload, // Payload JWT Aplikasi
			process.env.JWT_SECRET!,
			{ expiresIn: "1h" },
		);

		res.json({
			token: appJwtToken,
			msg: "Login berhasil (Auth Code Flow)",
		});
	} catch (error) {
		console.error("Error saat menukar kode atau memverifikasi token:", error);
		res.status(500).json({ message: "Otentikasi Google gagal." });
	}
});

router.post("/register", async (req: Request, res: Response) => {
	const user = req.body;
	const salt = await bcrypt.genSalt(10);

	try {
		// cek apakah user sudah ada atau belum
		const existingUser = await UserAuth.findOne({ email: user.email });

		if (existingUser) {
			return res.status(409).json({ msg: "Email sudah digunakan!" });
		}

		if (!user.username || !user.email || !user.password) {
			return res.status(403).json({ msg: "lengkapi datanya dulu!" });
		}

		user.password = await bcrypt.hash(user.password, salt);

		// buat data userData
		const newUserData = new UserData({
			orderList: [],
			purchaseItems: [],
			userProducts: [],
			username: user.username,
			loginWith: [
				{
					type: "email",
					email: user.email,
				},
			],
		});

		// buat data userAuth untuk
		const newUserAuth = new UserAuth({
			username: user.username,
			email: user.email,
			password: user.password,
			userData: newUserData._id, // ini merujuk ke dokumen userData yang telah dibuat
		});

		// simpan data user baru ke DB
		await Promise.all([newUserData.save(), newUserAuth.save()]);

		const appJwtToken = jwt.sign(
			{
				id: newUserAuth._id,
				username: newUserAuth.username,
				loginWith: "email",
			}, // Payload JWT Aplikasi
			process.env.JWT_SECRET!,
			{ expiresIn: "1h" },
		);

		res.status(201).json({
			success: true,
			msg: "berhasil registrasi",
			token: appJwtToken,
			data: {
				username: user.username,
				email: user.email,
				password: user.password,
			},
		});
	} catch (e) {
		if (isError(e)) {
			console.error(`Error message: ${e.message}`);
			res.status(500).json({ success: false, msg: "Server error" });
		}
	}
});

router.post("/login", async (req: Request, res: Response) => {
	if (!req.body.email || !req.body.password) {
		return res.status(403).json({ msg: "lengkapi datanya dulu!" });
	}
	try {
		// cari apakah user ada di DB atau tidak
		const user = await UserAuth.findOne({ email: req.body.email });

		// kalau gak ada maka respon = 404
		if (!user) {
			return res.status(404).json({
				msg: `User dengan email ${req.body.email} tidak ditemukan`,
			});
		}

		const isMatch = await bcrypt.compare(req.body.password, user.password!);

		// cek apakah password benar atau tidak
		if (isMatch) {
			// membuat id session
			// req.session.tes muali bagian tes namanya bisa diubah tapi entah mengapa kalau dinamai id kok gak bisa
			// untuk megset cookie pada express-session dilakukan dengan cara ini

			// req.session.data = {
			// 	id: user._id,
			// 	username: user.username,
			// 	email: user.email,
			// }; // berarti yang disimpan itu ini
			// req.session.save((err) => {
			// 	if (err) {
			// 		console.log("e", err);
			// 	}
			// });

			// membuat autentikasi menggunakan jsonwebtoken
			const payload = {
				id: user._id,
				username: user.username,
				email: user.email,
				loginWith: "email",
			};

			const token = jwt.sign(payload, process.env.JWT_SECRET!, {
				expiresIn: 60 * 60 * 1,
			});

			return res.status(200).json({
				msg: "user ditemukan dan berhasil login",
				data: {
					username: user.username,
					email: user.email,
					_id: user._id,
				},
				token: token,
			});
		} else {
			return res.status(401).json({ msg: "password salah" });
		}
	} catch (e) {
		if (isError(e)) {
			console.error(`Error message: ${e.message}`);
			res.status(500).json({ success: false, msg: "Server error" });
		}
	}
});

router.post("/logout", validationToken, async (req: Request, res: Response) => {
	if (!req.userData) {
		console.log("userData kosong");
		return res.status(401).json({
			msg: "Akses ditolak!",
		});
	}

	const userData = req.userData;
	let user;

	try {
		const authHeader = req.headers.authorization;

		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return res.status(401).json({ msg: "Akses ditolak. Token tidak valid." });
		}

		if (userData.loginWith === "google") {
			user = await UserAuthGoogle.findOne({ googleId: userData.id });

			await axios.post(
				"https://oauth2.googleapis.com/revoke",
				null,
				{ params: { token: userData.accessToken } }, // Token dikirim sebagai parameter
			);
		} else {
			user = await UserAuth.findById(userData.id);
		}

		const token = authHeader.split(" ")[1];

		// ganti jadi memasukan token jwt ke blaklist
		const isBlacklisted = await BLToken.findOne({ token: token });

		if (isBlacklisted) {
			return res.status(401).json({ msg: "Token sudah diblokir." });
		}

		const blacklistedToken = new BLToken({
			token: token,
			userId: user!.userData,
		});
		await blacklistedToken.save();

		res.status(200).json({
			msg: "Berhasil logout",
		});
	} catch (e) {
		if (isError(e)) {
			console.error(`Error message: ${e.message}`);
			res.status(500).json({ success: false, msg: "Server error" });
		}
	}
});

router.delete(
	"/unbind-account",
	validationToken,
	async (req: Request, res: Response) => {
		if (!req.userData) {
			console.log("userData kosong");
			return res.status(401).json({
				msg: "Akses ditolak!",
			});
		}

		const userData = req.userData;
		const { unbindType } = req.query;
		let user;

		console.log(unbindType, userData);

		try {
			if (userData.loginWith === "google") {
				user = await UserAuthGoogle.findOne({ googleId: userData.id }).populate(
					"userData",
				);
			} else {
				user = await UserAuth.findById(userData.id).populate("userData");
			}

			if (!user) {
				return res.status(404).json({
					msg: "Akun tidak ditemukan!",
				});
			}

			const converted = user.userData as unknown as UserDataType;

			console.log(converted, user);

			if (converted.loginWith.length === 1) {
				return res.status(400).json({
					msg: "Tidak dapat meng-unbind akun yang terikat dengan satu metode login!",
				});
			}

			switch (unbindType) {
				case "google": {
					// cari data userData dengan user.userData lalu hapus value "google" dari property loginWith
					const existedUserData = await UserData.findByIdAndUpdate(
						user.userData,
						{
							$pull: {
								loginWith: {
									type: "google",
								},
							},
						},
						{
							new: true,
						},
					);

					if (!existedUserData) {
						return res.status(404).json({
							msg: "Data user tidak ditemukan!",
						});
					}

					// cari data userauthgoogle dimana property userData = user.userData lalu hapus
					await UserAuthGoogle.findOneAndDelete({ userData: user.userData });

					res.status(200).json({
						msg: "Google unbind berhasil!",
						data: {
							username: user.username,
							email: user.email,
							loginWith: existedUserData.loginWith,
						},
					});
					break;
				}
				case "email": {
					// cari data userData dengan user.userData lalu hapus value "google" dari property loginWith
					const existedUserData = await UserData.findByIdAndUpdate(
						user.userData,
						{
							$pull: {
								loginWith: {
									type: "email",
								},
							},
						},
						{
							new: true,
						},
					);

					if (!existedUserData) {
						return res.status(404).json({
							msg: "Data user tidak ditemukan!",
						});
					}

					// cari data userauth dimana property userData = user.userData lalu hapus
					await UserAuth.findOneAndDelete({ userData: user.userData });

					res.status(200).json({
						msg: "Email unbind berhasil!",
						data: {
							username: user.username,
							email: user.email,
							loginWith: existedUserData.loginWith,
						},
					});
					break;
				}
				default: {
					res.status(400).json({ msg: "Bind method tidak tersedia." });
				}
			}
		} catch (e) {
			if (isError(e)) {
				console.error(`Error message: ${e.message}`);
				res.status(500).json({ success: false, msg: "Server error" });
			}
		}
	},
);

router.delete(
	"/delete-account",
	validationToken,
	async (req: Request, res: Response) => {
		if (!req.userData) {
			console.log("userData kosong");
			return res.status(401).json({
				msg: "Akses ditolak!",
			});
		}

		const userData = req.userData;
		let user;

		try {
			if (userData.loginWith === "google") {
				user = await UserAuthGoogle.findOne({ googleId: userData.id }).populate(
					"userData",
				);
			} else {
				user = await UserAuth.findById(userData.id).populate("userData");
			}

			if (!user) {
				return res.status(404).json({
					msg: "Akun tidak ditemukan!",
				});
			}

			// hapus userProducts
			await Product.deleteMany({ ownerId: user.userData._id });

			// hapus userData
			await UserData.deleteOne({ _id: user.userData._id });
			// hapus user dari userAuth & userAuthGoogle yang userData = user.userData
			await UserAuth.deleteOne({ userData: user.userData._id });
			await UserAuthGoogle.deleteOne({ userData: user.userData._id });

			res.status(200).json({
				msg: "Akun berhasil dihapus",
			});
		} catch (e) {
			if (isError(e)) {
				console.error(`Error message: ${e.message}`);
				res.status(500).json({ success: false, msg: "Server error" });
			}
		}
	},
);

export default router;
