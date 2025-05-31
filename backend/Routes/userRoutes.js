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
			const products = await Product.find({ ownerId: userData.id });
			const user = await User.findById({ _id: userData.id });

			if (!user || !products) {
				res.status(404).json({ message: "gagal" });
			}

			console.log(user, products);

			res.json({
				message: "hello: " + userData.username,
				products: products,
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

router.post("/respons", validationToken, async (req, res) => {
	const { respons } = req.body;
	const { index } = req.body;
	const userData = req.userData;

	try {
		const user = await User.findOne({ _id: userData.id });

		console.log(user);

		if (user.orderList.length > index) {
			user.orderList.splice(index, 1);

			await user.save();

			if (respons) {
				res.status(200).json({ message: "Permintaan diterima" });
			} else {
				res.status(200).json({ message: "Permintaan ditolak!" });
			}
		}
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: "ggal" });
	}
});
router.post("/register", async (req, res) => {
	const user = req.body;
	const salt = await bcrypt.genSalt(10);

	console.log(user.username, user.email, user.password);

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
	console.log("logout: ", req.session);
	console.log(req.session.cookie.maxAge);
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
