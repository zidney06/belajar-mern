import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User, { PurchaseItem, UserSchema } from "../models/userModel";
import { validationToken } from "../middlewares/middleware";

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
		const user = await User.findById(userData.id);

		if (!user) {
			return res.status(404).json({
				msg: "User tidak ditemukan",
			});
		}

		res.status(200).json({
			message: "Oke",
			isLogin: true,
		});
	} catch (e) {
		if (isError(e)) {
			console.error(`Error message: ${e.message}`);
			res.status(500).json({ success: false, msg: e.message });
		}
	}
});

router.get("/user-product", validationToken, async (req, res) => {
	if (!req.userData) {
		return res.status(401).json({
			msg: "Akses ditolak!",
		});
	}

	const userData = req.userData;

	try {
		const user = await User.findById({ _id: userData.id }).populate(
			"userProducts",
		);

		if (!user) {
			return res.status(404).json({ message: "gagal" });
		}

		console.log(user);

		res.json({
			username: userData.username,
			products: user.userProducts,
			orderList: user.orderList,
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
		const user = await User.findById(userData.id);

		if (!user) {
			return res.status(404).json({
				msg: "User tidak ditemukan",
			});
		}

		console.log(user.purchaseItems);
		if (!user) {
			return res.status(404).json({
				msg: "User tidak ditemukan",
			});
		}

		res.status(200).json({
			msg: "Berhasil",
			data: user.purchaseItems,
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
			// hapus permintaan pembelian pembeli (buyer) dari orderList
			const seller: UserSchema | null = await User.findByIdAndUpdate(
				userData.id,
				{
					$pull: {
						orderList: {
							_id: orderId,
						},
					},
				},
			);

			if (!seller) {
				return res.status(404).json({
					msg: "Seller tidak ditemukan",
				});
			}

			console.log(seller.orderList);

			// update status pembelian
			const buyer = await User.findByIdAndUpdate(
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
					// 🚨 arrayFilters: Kriteria untuk menemukan elemen array yang akan diubah
					arrayFilters: [
						{ "item.item._id": product._id }, // Cari item di array di mana item.item._id cocok dengan product._id
					],
					new: true, // WAJIB: Mengembalikan dokumen 'User' setelah pembaruan
					runValidators: true, // Opsional: Jalankan validasi Mongoose
				},
			);

			if (!buyer) {
				return res.status(404).json({
					msg: "Buyer tidak ditemukan",
				});
			}

			console.log(buyer.purchaseItems);

			res.status(200).json({
				msg: "Permintaan diterima",
				data: {
					orderId,
				},
			});
		} else {
			// hapus permintaan pembelian pembeli (buyer) dari orderList
			const seller: UserSchema | null = await User.findByIdAndUpdate(
				userData.id,
				{
					$pull: {
						orderList: {
							_id: orderId,
						},
					},
				},
			);

			if (!seller) {
				return res.status(404).json({
					msg: "Seller tidak ditemukan",
				});
			}

			console.log(seller.orderList);

			const buyer = await User.findByIdAndUpdate(
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

			if (!buyer) {
				return res.status(404).json({
					msg: "Buyer tidak ditemukan",
				});
			}

			console.log(buyer.purchaseItems);

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

	// cek apakah user sudah ada atau belum
	const existingUser = await User.findOne({ email: user.email });

	if (existingUser) {
		return res.status(409).json({ message: "Email sudah digunakan!" });
	}

	if (!user.username || !user.email || !user.password) {
		return res.status(403).json({ message: "lengkapi datanya dulu!" });
	}

	user.password = await bcrypt.hash(user.password, salt);

	const newUser = new User({
		username: user.username,
		email: user.email,
		password: user.password,
	});

	try {
		// simpan data user baru ke DB
		await newUser.save();

		res.status(201).json({
			success: true,
			message: "berhasil registrasi",
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
		return res.status(403).json({ message: "lengkapi datanya dulu!" });
	}
	try {
		// cari apakah user ada di DB atau tidak
		const user = await User.findOne({ email: req.body.email });

		// kalau gak ada maka respon = 404
		if (!user) {
			return res.status(404).json({
				message: `User dengan email ${req.body.email} tidak ditemukan`,
			});
		}

		const isMatch = await bcrypt.compare(req.body.password, user.password);

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
				message: "user ditemukan dan berhasil login",
				data: {
					username: user.username,
					email: user.email,
					_id: user._id,
				},
				token: token,
			});
		} else {
			return res.status(401).json({ message: "password salah" });
		}
	} catch (e) {
		if (isError(e)) {
			console.error(`Error message: ${e.message}`);
			res.status(500).json({ success: false, msg: "Server error" });
		}
	}
});

// memperbarui sesi
router.post("/logout", (req, res) => {
	// ini digunakan untuk menghaous sesi disisi server

	try {
		// ganti jadi memasukan token jwt ke blaklist
		// sementara langsung oke aja
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
