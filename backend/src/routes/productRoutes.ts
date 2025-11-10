import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { validationToken, storage } from "../middlewares/middleware";
import User from "../models/userModel";
import Product from "../models/product.model";

const upload = multer({
	storage,
	limits: { fileSize: 1024 * 1024 * 5 },
}); // Batasi ukuran file hingga 5MB

const router = express.Router();

function isError(error: any): error is { message: string } {
	return error && typeof error === "object" && "message" in error;
}

router.get("/", async (req, res) => {
	try {
		const products = await Product.find({}); //kosong artinya kita mengambil semua data yang ada pada db

		res.status(200).json({ success: true, data: products });
	} catch (e) {
		if (isError(e)) {
			console.error(`Error message: ${e.message}`);
			res.status(500).json({ success: false, message: "server error" });
		}
	}
});

router.post("/", validationToken, upload.single("file"), async (req, res) => {
	if (!req.userData) {
		return res.status(401).json({
			msg: "Akses ditolak!",
		});
	}

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
		if (isError(e)) {
			console.error(`Error message: ${e.message}`);
			res.status(500).json({ success: false, msg: "Server error" });
		}
	}
});

// pindahkan route ini ke userRoutes untuk mengirimkan data pesanan milik akun bersangkutan
// perbaiki ini
router.post("/buy-product", validationToken, async (req, res) => {
	if (!req.userData) {
		return res.status(401).json({
			msg: "Akses ditolak!",
		});
	}

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
			buyerId: buyer._id,
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
			if (isError(e)) {
				console.error(`Error message: ${e.message}`);
				res.status(500).json({ success: false, msg: "Server error" });
			}
		}
	},
);

router.put(
	"/update-with-file/:id",
	validationToken,
	upload.single("file"),
	async (req, res) => {
		if (!req.userData) {
			return res.status(401).json({
				msg: "Akses ditolak!",
			});
		}

		const { id } = req.params;
		const newProduct = JSON.parse(req.body.data);
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

		if (!req.file) {
			return res.status(40).json({
				msg: "harap upload file",
			});
		}

		try {
			const filePath = path.join(
				path.dirname(fileURLToPath(__dirname)),
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
			if (isError(e)) {
				console.error(`Error message: ${e.message}`);
				res.status(500).json({ success: false, msg: "Server error" });
			}
		}
	},
);

// hapus riwayat pembelian
router.delete("/purchase/:purchaseId", validationToken, async (req, res) => {
	if (!req.userData) {
		return res.status(401).json({
			msg: "Akses ditolak!",
		});
	}

	const { purchaseId } = req.params;
	const userData = req.userData;

	try {
		const user = await User.findByIdAndUpdate(
			userData.id,
			{
				$pull: {
					purchaseItems: {
						_id: purchaseId,
					},
				},
			},
			{ new: true, runValidators: true },
		);

		if (!user) {
			return res.status(404).json({
				msg: "User tidak ditemukan",
			});
		}

		console.log(user.purchaseItems, "del purchase");

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

	try {
		const productExist = await Product.findById(id);

		if (!productExist) {
			console.log(`data id: ${id} tidak ditemukan`);
			return res.status(404).json({ message: "data tidak ditemukan" });
		}

		console.log(productExist, "del");

		// hapus gambar di folder uploads
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

		res.status(200).json({ success: true, msg: "data berhasil dihapus" });
	} catch (e) {
		if (isError(e)) {
			console.error(`Error message: ${e.message}`);
			res.status(500).json({ success: false, msg: "Server error" });
		}
	}
});

export default router;
