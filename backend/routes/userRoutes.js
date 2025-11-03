import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import Product from "../models/product.model.js";
import { validationToken } from "../middlewares/middleware.js";

const router = express.Router();

router.get("/user-product", validationToken, async (req, res) => {
	const userData = req.userData;

	if (userData || req.body) {
		try {
			const user = await User.findById({ _id: userData.id }).populate(
				"userProducts",
			);

			if (!user) {
				res.status(404).json({ message: "gagal" });
			}

			console.log(user);

			res.json({
				username: userData.username,
				products: user.userProducts,
				orderList: user.orderList,
			});
		} catch (err) {
			console.log(err);
			res.status(500).json({ message: "gagal" });
		}
	} else {
		res.status(401).json({ message: "login dulu wak" });
	}
});
router.get("/purchase-history", validationToken, async (req, res) => {
	const userData = req.userData;

	try {
		const user = await User.findById(userData.id);

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
	} catch (err) {
		console.log(err);
		res.status(500).json({
			msg: "Internal server error",
		});
	}
});
/*
fitur membeli barang itu hanya untuk memberitahu seller kalau ada user yang beli
kalau bisa, pembeli diberi tahu barang yang usdah disetujui
*/
router.post("/respons", validationToken, async (req, res) => {
	const { respons, product, buyerId, orderId } = req.body;
	const userData = req.userData;

	try {
		const seller = await User.findById(userData.id);
		const buyer = await User.findById(buyerId);

		if (!seller || !buyer) {
			return res.status(404).json({
				msg: "Seller atau buyer tidak ditemukan",
			});
		}

		console.log(seller.orderList, orderId, 1);

		if (respons) {
			// hapus permintaan pembelian buyer dari list
			seller.orderList = seller.orderList.filter(
				(item) => item._id.toString() !== orderId.toString(),
			);

			// update status pembelian
			buyer.purchaseItems = buyer.purchaseItems.map((item) => {
				if ((item.item._id.toString(), product._id.toString())) {
					item.status = "completed";
					return item;
				}
				return item;
			});

			console.log(buyer.purchaseItems, 2);

			await Promise.all([buyer.save(), seller.save()]);
			res.status(200).json({
				msg: "Permintaan diterima",
				data: {
					orderId,
				},
			});
		} else {
			// update status pembelian
			buyer.purchaseItems = buyer.purchaseItems.map((item) => {
				console.log(item.item._id.toString(), product._id.toString());
				if ((item.item._id.toString(), product._id.toString())) {
					item.status = "cancelled";
					return item;
				}
				return item;
			});

			// hapus permintaan pembelian buyer dari list
			seller.orderList = seller.orderList.filter(
				(item) => item._id.toString() !== orderId.toString(),
			);

			console.log(buyer.purchaseItems, 2);

			await Promise.all([buyer.save(), seller.save()]);
			res.status(200).json({
				msg: "Permintaan ditolak",
				data: {
					orderId,
				},
			});
		}
	} catch (err) {
		console.log(err);
		res.status(500).json({ msg: "Terjadi masalah" });
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

	if ((!user.username, !user.email, !user.password)) {
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
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ success: false, messsage: "internal server error" });
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

			const token = jwt.sign(payload, process.env.JWT_SECRET, {
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
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ success: false, message: "internal server error" });
	}
});

// memperbarui sesi
router.post("/logout", (req, res) => {
	// ini digunakan untuk menghaous sesi disisi server
	req.session.destroy((err) => {
		if (err) {
			return res.status(500).json({ message: "gagal logout" });
		}
		res.clearCookie("connect.sid"); // ini digunakan untuk menghapus cookie di sisi client
		res.json({ message: "berhasil logout" });
	});
});

router.get("/user-info", validationToken, (req, res) => {
	res.status(200).json({
		message: "Oke",
		isLogin: true,
	});
});

export default router;
