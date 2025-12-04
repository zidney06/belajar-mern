import express, { Request, Response } from "express";
import UserData, { UserDataType } from "../models/userDataModel";
import { validationToken } from "../middlewares/middleware";
import UserAuth, { UserAuthType } from "../models/userAuthModel";
import UserAuthGoogle, {
	UserAuthGoogleType,
} from "../models/userAuthGoogleModel";

const router = express.Router();

function isError(error: any): error is { message: string } {
	return error && typeof error === "object" && "message" in error;
}

router.get(
	"/user-account",
	validationToken,
	async (req: Request, res: Response) => {
		if (!req.userData) {
			console.log("userData kosong");
			return res.status(401).json({
				msg: "Akses ditolak!",
			});
		}

		let user;

		try {
			if (req.userData.loginWith === "google") {
				user = (await UserAuthGoogle.findOne({
					googleId: req.userData.id,
				}).populate("userData")) as unknown as UserAuthGoogleType;
			} else {
				user = (await UserAuth.findById(req.userData.id).populate(
					"userData",
				)) as unknown as UserAuthType;
			}

			if (!user) {
				return res.status(404).json({
					msg: "Akun tidak ditemukan!",
				});
			}

			const userData = user.userData as unknown as UserDataType;

			res.status(200).json({
				data: {
					username: user.username,
					email: user.email,
					loginWith: userData.loginWith,
				},
				msg: "Berhasil mendapatkan akun pengguna!",
			});
		} catch (e) {
			if (isError(e)) {
				console.error(`Error message: ${e.message}`);
				res.status(500).json({ success: false, msg: e.message });
			}
		}
	},
);

router.get(
	"/user-info",
	validationToken,
	async (req: Request, res: Response) => {
		if (!req.userData) {
			// ini buat mastiin kalau req.userData itu bukan undefined
			return res.status(401).json({
				msg: "Akses ditolak!",
			});
		}

		const userData = req.userData;
		let user;

		try {
			if (userData.loginWith === "google") {
				user = await UserAuthGoogle.findOne({ googleId: userData.id });
			} else {
				user = await UserAuth.findById(userData.id);
			}

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
	},
);

router.get(
	"/user-product",
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
				user = await UserAuthGoogle.findOne({ googleId: userData.id })
					.populate({
						path: "userData",
						populate: {
							path: "userProducts",
						},
					})
					.exec();
			} else {
				user = await UserAuth.findById(userData.id)
					.populate({
						path: "userData",
						populate: {
							path: "userProducts",
						},
					})
					.exec();
			}

			if (!user) {
				return res.status(404).json({ msg: "User tidak ditemukan" });
			}

			// agar ts tidak rewel di
			const converted = user.userData as unknown as UserDataType;

			console.log(converted);

			res.json({
				username: user.username,
				products: converted.userProducts,
				orderList: converted.orderList,
			});
		} catch (e) {
			if (isError(e)) {
				console.error(`Error message: ${e.message}`);
				res.status(500).json({ success: false, msg: "Server error" });
			}
		}
	},
);
router.get(
	"/purchase-history",
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
					msg: "User tidak ditemukan",
				});
			}

			// agar ts tidak rewel di
			const converted = user.userData as unknown as UserDataType;

			res.status(200).json({
				msg: "Berhasil",
				data: converted.purchaseItems,
			});
		} catch (e) {
			if (isError(e)) {
				console.error(`Error message: ${e.message}`);
				res.status(500).json({ success: false, msg: "Server error" });
			}
		}
	},
);

router.post(
	"/respons",
	validationToken,
	async (req: Request, res: Response) => {
		if (!req.userData) {
			console.log("userData kosong");
			return res.status(401).json({
				msg: "Akses ditolak!",
			});
		}

		const { respons, product, buyerId, orderId } = req.body;
		const userData = req.userData;
		let seller;

		try {
			if (respons) {
				// ambil data seller lewat userAuth
				// rubah bagian mengambil user data menjadi
				if (userData.loginWith === "google") {
					seller = await UserAuthGoogle.findOne({ googleId: userData.id });
				} else {
					seller = await UserAuth.findById(userData.id);
				}

				if (!seller) {
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
					buyerId, // ID dokumen User yang dicari
					{
						// 💡 Operator $set dengan notasi positional $[] (arrayFilters)
						$set: {
							// Perbarui properti 'status' dari elemen array 'purchaseItems'
							// [item] adalah nama filter yang didefinisikan di bawah
							"purchaseItems.$[item].status": "completed",
						},
					},
					{
						// arrayFilters: Kriteria untuk menemukan elemen array yang akan diubah
						arrayFilters: [
							{ "item.item._id": product._id }, // Cari item di array di mana item.item._id cocok dengan product._id
						],
						new: true,
						runValidators: true,
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
				if (userData.loginWith === "google") {
					seller = await UserAuthGoogle.findOne({ googleId: userData.id });
				} else {
					seller = await UserAuth.findById(userData.id);
				}

				if (!seller) {
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
					buyerId, // ID dokumen User yang dicari
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
	},
);

export default router;
