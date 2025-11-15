import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserData, { UserDataType } from "../models/userDataModel";
import BLToken from "../models/BLTokenModel";
import { validationToken } from "../middlewares/middleware";
import UserAuth from "../models/userAuthModel";

const router = express.Router();

function isError(error: any): error is { message: string } {
	return error && typeof error === "object" && "message" in error;
}

router.get("/user-info", validationToken, async (req, res) => {
	if (!req.userData) {
		// ini buat mastiin kalau req.userData itu bukan undefined
		return res.status(401).json({
			msg: "Akses ditolak!",
		});
	}

	const userData = req.userData;

	try {
		const user = await UserAuth.findById(userData.id);

		if (!user) {
			return res.status(404).json({
				msg: "User tidak ditemukan",
			});
		}

		res.status(200).json({
			msg: "Oke",
			isLogin: true,
		});
	} catch (e) {
		if (isError(e)) {
			console.error(`Error message: ${e.message}`);
			res.status(500).json({ success: false, msg: e.message });
		}
	}
});

interface UserAuthType {
	_id: string;
	email: string;
	password: string;
	userData: UserDataType;
}

router.get("/user-product", validationToken, async (req, res) => {
	if (!req.userData) {
		return res.status(401).json({
			msg: "Akses ditolak!",
		});
	}

	const userData = req.userData;

	try {
		const user = await UserAuth.findById(userData.id)
			.populate({
				path: "userData",
				populate: {
					path: "userProducts",
				},
			})
			.exec();

		if (!user) {
			return res.status(404).json({ msg: "User tidak ditemukan" });
		}

		// agar ts tidak rewel di
		const converted = user as unknown as UserAuthType;

		console.log(converted);

		res.json({
			username: user.username,
			products: converted.userData.userProducts,
			orderList: converted.userData.orderList,
		});
	} catch (e) {
		if (isError(e)) {
			console.error(`Error message: ${e.message}`);
			res.status(500).json({ success: false, msg: "Server error" });
		}
	}
});
router.get("/purchase-history", validationToken, async (req, res) => {
	if (!req.userData) {
		return res.status(401).json({
			msg: "Akses ditolak!",
		});
	}

	const userData = req.userData;

	try {
		const user = await UserAuth.findById(userData.id).populate("userData");

		if (!user) {
			return res.status(404).json({
				msg: "User tidak ditemukan",
			});
		}

		// agar ts tidak rewel di
		const converted = user as unknown as UserAuthType;

		res.status(200).json({
			msg: "Berhasil",
			data: converted.userData.purchaseItems,
		});
	} catch (e) {
		if (isError(e)) {
			console.error(`Error message: ${e.message}`);
			res.status(500).json({ success: false, msg: "Server error" });
		}
	}
});
/*
fitur membeli barang itu hanya untuk memberitahu seller kalau ada user yang beli
kalau bisa, pembeli diberi tahu barang yang usdah disetujui
*/

router.post("/respons", validationToken, async (req, res) => {
	if (!req.userData) {
		return res.status(401).json({
			msg: "Akses ditolak!",
		});
	}

	const { respons, product, buyerId, orderId } = req.body;
	const userData = req.userData;

	try {
		if (respons) {
			// ambil data seller lewat userAuth
			const seller = await UserAuth.findById(userData.id);
			const buyer = await UserAuth.findById(buyerId);

			if (!seller) {
				return res.status(404).json({
					msg: "Seller tidak ditemukan",
				});
			}

			if (!buyer) {
				return res.status(404).json({
					msg: "Seller tidak ditemukan",
				});
			}

			// baru lakukan operasi pada property userData
			// hapus permintaan pembelian pembeli (buyer) dari orderList
			const sellerData = await UserData.findByIdAndUpdate(
				seller.userData,
				{
					$pull: {
						orderList: {
							_id: orderId,
						},
					},
				},
				{
					new: true,
				},
			);

			if (!sellerData) {
				return res.status(404).json({
					msg: "Seller tidak ditemukan",
				});
			}

			// update status pembelian
			const buyerData = await UserData.findByIdAndUpdate(
				buyer.userData, // ID dokumen User yang dicari
				{
					// 💡 Operator $set dengan notasi positional $[] (arrayFilters)
					$set: {
						// Perbarui properti 'status' dari elemen array 'purchaseItems'
						// [item] adalah nama filter yang didefinisikan di bawah
						"purchaseItems.$[item].status": "completed",
					},
				},
				{
					// 🚨 arrayFilters: Kriteria untuk menemukan elemen array yang akan diubah
					arrayFilters: [
						{ "item.item._id": product._id }, // Cari item di array di mana item.item._id cocok dengan product._id
					],
					new: true, // WAJIB: Mengembalikan dokumen 'User' setelah pembaruan
					runValidators: true, // Opsional: Jalankan validasi Mongoose
				},
			);

			if (!buyerData) {
				return res.status(404).json({
					msg: "Buyer tidak ditemukan",
				});
			}

			res.status(200).json({
				msg: "Permintaan diterima",
				data: {
					orderId,
				},
			});
		} else {
			// ambil data seller lewat userAuth
			const seller = await UserAuth.findById(userData.id);
			const buyer = await UserAuth.findById(buyerId);

			if (!seller) {
				return res.status(404).json({
					msg: "Seller tidak ditemukan",
				});
			}

			if (!buyer) {
				return res.status(404).json({
					msg: "Seller tidak ditemukan",
				});
			}
			// hapus permintaan pembelian pembeli (buyer) dari orderList
			const sellerData = await UserData.findByIdAndUpdate(
				seller.userData,
				{
					$pull: {
						orderList: {
							_id: orderId,
						},
					},
				},
				{
					new: true,
				},
			);

			if (!sellerData) {
				return res.status(404).json({
					msg: "Seller tidak ditemukan",
				});
			}

			const buyerData = await UserData.findByIdAndUpdate(
				buyer.userData, // ID dokumen User yang dicari
				{
					// 💡 Operator $set dengan notasi positional $[] (arrayFilters)
					$set: {
						// Perbarui properti 'status' dari elemen array 'purchaseItems'
						// [item] adalah nama filter yang didefinisikan di bawah
						"purchaseItems.$[item].status": "cancelled",
					},
				},
				{
					// 🚨 arrayFilters: Kriteria untuk menemukan elemen array yang akan diubah
					arrayFilters: [
						{ "item.item._id": product._id }, // Cari item di array di mana item.item._id cocok dengan product._id
					],
					new: true, // WAJIB: Mengembalikan dokumen 'User' setelah pembaruan
					runValidators: true, // Opsional: Jalankan validasi Mongoose
				},
			);

			if (!buyerData) {
				return res.status(404).json({
					msg: "Buyer tidak ditemukan",
				});
			}

			res.status(200).json({
				msg: "Permintaan ditolak",
				data: {
					orderId,
				},
			});
		}
	} catch (e) {
		if (isError(e)) {
			console.error(`Error message: ${e.message}`);
			res.status(500).json({ success: false, msg: "Server error" });
		}
	}
});
router.post("/register", async (req, res) => {
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
		});

		// buat data userAuth untuk
		const newUserAuth = new UserAuth({
			username: user.username,
			email: user.email,
			password: user.password,
			userData: newUserData._id, // ini merujuk ke dokumen userData yang telah dibuat
		});

		// simpan data user baru ke DB
		await newUserAuth.save();
		await newUserData.save();

		res.status(201).json({
			success: true,
			msg: "berhasil registrasi",
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

router.post("/login", async (req, res) => {
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

// memperbarui sesi
router.post("/logout", validationToken, async (req: Request, res: Response) => {
	console.log("Fitur blacklist token\n");
	if (!req.userData) {
		return res.status(401).json({
			msg: "Akses ditolak!",
		});
	}
	try {
		const authHeader = req.headers.authorization;

		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return res.status(401).json({ msg: "Akses ditolak. Token tidak valid." });
		}

		const token = authHeader.split(" ")[1];

		// ganti jadi memasukan token jwt ke blaklist
		const isBlacklisted = await BLToken.findOne({ token: token });

		if (isBlacklisted) {
			return res.status(401).json({ msg: "Token sudah diblokir." });
		}

		const blacklistedToken = new BLToken({
			token: token,
			userId: req.userData.id,
		});
		await blacklistedToken.save();

		console.log(blacklistedToken, "token");

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

export default router;
