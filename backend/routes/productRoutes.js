import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { validationToken, storage } from "../middlewares/middleware.js";
import User from "../models/userModel.js";
import Product from "../models/product.model.js";

const upload = multer({ storage });

const router = express.Router();

router.get("/", async (req, res) => {
	try {
		const products = await Product.find({}); //kosong artinya kita mengambil semua data yang ada pada db

		res.status(200).json({ success: true, data: products });
	} catch (e) {
		console.log("terjadi error: " + e.message);
		res.status(500).json({ success: false, message: "server error" });
	}
});

router.post("/", validationToken, upload.single("file"), async (req, res) => {
	const userData = req.userData;

	try {
		const user = await User.findById(userData.id);

		if (!user) {
			return res.status(401).json({ message: "User tidak ditemukan!" });
		}

		// cek apakah user mengirimkan file atau tidak
		if (!req.file) {
			return res.status(400).json({ message: "no file uploaded" });
		}

		const product = JSON.parse(req.body.data);

		product.imageUrl = `http://localhost:3000/folder/fotos/${req.file.filename}`;

		if (
			!product.author ||
			!product.price ||
			!product.imageUrl ||
			!product.title ||
			!product.ISBN
		) {
			return res
				.status(403)
				.json({ success: false, message: "tolong masukan data dengan benar" });
		}

		const newProduct = new Product({
			...product,
			imageName: req.file.filename,
			ownerId: user._id,
		});

		// masukan id barang baru ke dalam array produk milik user
		user.userProducts.push(newProduct._id);

		await Promise.all([newProduct.save(), user.save()]);

		res.status(201).json({
			success: true,
			data: newProduct,
			filename: req.file.filename,
			path: `../uploads/files/${req.file.filename}`,
		});
	} catch (e) {
		console.log("terjadi error: " + e.message);
		res.status(500).json({ success: false, messsage: "internal server error" });
	}
});

// pindahkan route ini ke userRoutes untuk mengirimkan data pesanan milik akun bersangkutan
// perbaiki ini
router.post("/buy-product", validationToken, async (req, res) => {
	const user = req.userData;
	const { productId } = req.body;

	console.log(productId);

	try {
		const dataProduct = await Product.findById(productId);

		if (!dataProduct) {
			return res.status(404).json({
				msg: "Produk tidak ditemukan",
			});
		}

		const seller = await User.findById(dataProduct.ownerId);
		const buyer = await User.findById(user.id);

		if (!seller || !buyer) {
			return res.status(404).json({
				msg: "Penjual atau pembeli tidak ditemukan",
			});
		}

		// pastikan pembeli bukan penjual itu sendiri
		if (buyer.username === seller.username) {
			return res.status(400).json({
				msg: "Anda tidak dapat membeli produk sendiri",
			});
		}

		seller.orderList.push({
			buyerId: user.id,
			sellerId: seller._id,
			item: dataProduct,
		});

		buyer.purchaseItems.push({
			item: dataProduct,
			status: "pending",
			sellerId: seller._id,
		});

		await Promise.all([seller.save(), buyer.save()]);

		res.status(200).json({ msg: "Pembelian telah diterima!" });
	} catch (err) {
		console.log(err);
		res.status(500).json({ msg: "Terjadi kesalahan!" });
	}
});

router.put(
	"/update-without-file/:id",
	validationToken,
	upload.none(), // kalo gak upload file
	async (req, res) => {
		const { id } = req.params;
		const userData = req.userData;
		const newProduct = JSON.parse(req.body.data);

		console.log("tanpa ada file", newProduct);

		try {
			const existedProduct = await Product.findById(id);

			if (!existedProduct) {
				return res
					.status(404)
					.json({ succesa: false, message: "data tidak ditemukan" });
			}

			const updatedProduct = await Product.findByIdAndUpdate(id, newProduct, {
				new: true,
			});

			console.log(updatedProduct);
			res.status(201).json({ success: true, data: updatedProduct });
		} catch (e) {
			console.log("terjadi error: " + e.message);
			res
				.status(500)
				.json({ success: false, messsage: "internal server error" });
		}
	},
);

router.put(
	"/update-with-file/:id",
	validationToken,
	upload.single("file"),
	async (req, res) => {
		const { id } = req.params;

		const userData = req.userData;

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res
				.status(404)
				.json({ succesa: false, message: "data tidak ditemukan" });
		}

		// cek apakah user memiliki sesi atau tidak
		if (!userData) {
			return res.status(401).json({ message: "Sesi anda telah habis" });
		}

		const newProduct = JSON.parse(req.body.data);

		try {
			const filePath = path.join(
				path.dirname(fileURLToPath(import.meta.url)),
				`../uploads/${newProduct.imageName}`,
			);

			// hapus gambar sebelumnya
			fs.unlink(filePath, (err) => {
				if (err) {
					console.log("gagal menghapus file", err);
					return;
				}
				console.log("berhasil menghapus file");
			});

			newProduct.imageUrl = `http://localhost:3000/folder/fotos/${req.file.filename}`;
			newProduct.imageName = req.file.filename;

			console.log(newProduct, req.file);
			// const updatedProduct = 'tes'
			const updatedProduct = await Product.findByIdAndUpdate(id, newProduct, {
				new: true,
			});
			res.status(201).json({ success: true, data: updatedProduct });
		} catch (e) {
			console.log("terjadi error: " + e.message);
			res
				.status(500)
				.json({ success: false, messsage: "internal server error" });
		}
	},
);

// hapus riwayat pembelian
router.delete("/:purchaseId", validationToken, async (req, res) => {
	const { purchaseId } = req.params;
	const userData = req.userData;

	try {
		const user = await User.findById(userData.id);

		console.log(user.purchaseItems, 1);

		user.purchaseItems = user.purchaseItems.filter(
			(history) => history._id.toString() !== purchaseId,
		);

		console.log(user.purchaseItems, 2);

		await user.save();

		res.status(200).json({
			msg: "Berhasil menghapus riwayat pembelian",
			data: purchaseId,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			msg: "Terjadi kesalahan",
		});
	}
});

router.delete("/:id", async (req, res) => {
	const { id } = req.params;
	console.log(id);

	const productExist = await Product.findOne({ _id: id });

	if (!productExist) {
		console.log(`data id: ${id} tidak ditemukan`);
		return res.status(404).json({ message: "data tidak ditemukan" });
	}

	console.log(productExist);

	try {
		// hapus gambar di folder uploads
		const __filename = fileURLToPath(import.meta.url);
		const __dirname = path.dirname(__filename);
		const filePath = path.join(
			__dirname,
			`../uploads/${productExist.imageName}`,
		);

		await productExist.deleteOne();

		fs.unlink(filePath, (err) => {
			if (err) {
				console.log("gagal menghapus file", err);
				return;
			}
			console.log("berhasil menghapus file");
		});

		res.status(200).json({ success: true, message: "data berhasil dihapus" });
	} catch (e) {
		console.log("error: " + e.message);
		res.status(404).json({ success: false, message: "data tidak ditemukan" });
	}
});

export default router;
