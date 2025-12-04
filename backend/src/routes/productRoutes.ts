import express, { Request, Response } from "express";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import fs from "fs";
import { validationToken, storage } from "../middlewares/middleware";
import UserData, { UserDataType } from "../models/userDataModel";
import Product from "../models/product.model";
import UserAuth from "../models/userAuthModel";
import UserAuthGoogle from "../models/userAuthGoogleModel";

interface UserAuthType {
	_id: string;
	email: string;
	password: string;
	userData: UserDataType;
}

const upload = multer({
	storage,
	limits: { fileSize: 1024 * 1024 * 5 },
}); // Batasi ukuran file hingga 5MB

const router = express.Router();

function isError(error: any): error is { message: string } {
	return error && typeof error === "object" && "message" in error;
}

router.get("/", async (req: Request, res: Response) => {
	try {
		const products = await Product.find({}); //kosong artinya kita mengambil semua data yang ada pada db

		res.status(200).json({ success: true, data: products });
	} catch (e) {
		if (isError(e)) {
			console.error(`Error message: ${e.message}`);
			res.status(500).json({ success: false, msg: "server error" });
		}
	}
});

router.post(
	"/",
	validationToken,
	upload.single("file"),
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
				user = await UserAuthGoogle.findOne({ googleId: userData.id });
			} else {
				user = await UserAuth.findById(userData.id);
			}
			if (!user) {
				return res.status(401).json({ msg: "User tidak ditemukan!" });
			}

			// agar ts tidak rewel karena property userData baru terisi saat run time
			const converted = user as unknown as UserAuthType;

			// cek apakah user mengirimkan file atau tidak
			if (!req.file) {
				return res.status(400).json({ msg: "no file uploaded" });
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
					.json({ success: false, msg: "tolong masukan data dengan benar" });
			}

			const newProduct = new Product({
				...product,
				imageName: req.file.filename,
				ownerId: converted.userData,
			});

			// masukan id barang baru ke dalam array produk milik user
			const data = await UserData.findByIdAndUpdate(
				converted.userData,
				{
					$push: {
						userProducts: newProduct._id,
					},
				},
				{ new: true },
			);

			if (!data) {
				return res.status(404).json({ success: false, msg: "User not found" });
			}

			await newProduct.save();

			res.status(201).json({
				success: true,
				data: newProduct,
				filename: req.file.filename,
				path: `../../uploads/files/${req.file.filename}`,
			});
		} catch (e) {
			if (isError(e)) {
				console.error(`Error message: ${e.message}`);
				res.status(500).json({ success: false, msg: "Server error" });
			}
		}
	},
);

// pindahkan route ini ke userRoutes untuk mengirimkan data pesanan milik akun bersangkutan
// perbaiki ini
router.post(
	"/buy-product",
	validationToken,
	async (req: Request, res: Response) => {
		if (!req.userData) {
			console.log("userData kosong");
			return res.status(401).json({
				msg: "Akses ditolak!",
			});
		}

		const userData = req.userData;
		const { productId } = req.body;
		let buyer;

		try {
			const dataProduct = await Product.findById(productId);

			if (!dataProduct) {
				return res.status(404).json({
					msg: "Produk tidak ditemukan",
				});
			}

			// tambahi bedasarkan metode login
			if (userData.loginWith === "google") {
				buyer = await UserAuthGoogle.findOne({ googleId: userData.id });
			} else {
				buyer = await UserAuth.findById(userData.id);
			}

			const seller = await UserData.findById(dataProduct.ownerId);
			console.log(seller, buyer);

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

			// rubah memakai findByIdAndUpdate
			await Promise.all([
				UserData.findByIdAndUpdate(
					seller._id,
					{
						$push: {
							orderList: {
								buyerId: buyer.userData,
								sellerId: seller._id,
								item: dataProduct,
							},
						},
					},
					{ new: true },
				),
				UserData.findByIdAndUpdate(buyer.userData, {
					$push: {
						purchaseItems: {
							item: dataProduct,
							status: "pending",
							sellerId: seller._id,
						},
					},
				}),
			]);

			res.status(200).json({ msg: "Pembelian telah diterima!" });
		} catch (e) {
			if (isError(e)) {
				console.error(`Error message: ${e.message}`);
				res.status(500).json({ success: false, msg: "Server error" });
			}
		}
	},
);

router.put(
	"/update-without-file/:id",
	validationToken,
	upload.none(), // kalo gak upload file
	async (req: Request, res: Response) => {
		const { id } = req.params;
		const newProduct = JSON.parse(req.body.data);

		try {
			const existedProduct = await Product.findById(id);

			if (!existedProduct) {
				return res
					.status(404)
					.json({ success: false, msg: "data tidak ditemukan" });
			}

			const updatedProduct = await Product.findByIdAndUpdate(id, newProduct, {
				new: true,
				runValidators: true,
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

router.put(
	"/update-with-file/:id",
	validationToken,
	upload.single("file"),
	async (req: Request, res: Response) => {
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
				.json({ success: false, msg: "data tidak ditemukan" });
		}

		// cek apakah file ada atau gak
		if (!req.file) {
			return res.status(400).json({
				msg: "harap upload file",
			});
		}

		try {
			const filePath = path.join(
				__dirname,
				`../../uploads/${newProduct.imageName}`,
			);

			// hapus gambar sebelumnya
			fs.unlink(filePath, (err) => {
				if (err) {
					console.log("gagal menghapus gambar", err);
					return;
				}
				console.log("berhasil menghapus gambar");
			});

			newProduct.imageUrl = `http://localhost:3000/folder/fotos/${req.file.filename}`;
			newProduct.imageName = req.file.filename;

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
router.delete(
	"/purchase/:purchaseId",
	validationToken,
	async (req: Request, res: Response) => {
		if (!req.userData) {
			console.log("userData kosong");
			return res.status(401).json({
				msg: "Akses ditolak!",
			});
		}

		const { purchaseId } = req.params;
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

			const data = await UserData.findByIdAndUpdate(
				user.userData,
				{
					$pull: {
						purchaseItems: {
							_id: purchaseId,
						},
					},
				},
				{ new: true, runValidators: true },
			);

			if (!data) {
				return res.status(404).json({
					msg: "User tidak ditemukan",
				});
			}

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
	},
);

router.delete("/:id", async (req: Request, res: Response) => {
	const { id } = req.params;

	try {
		const productExist = await Product.findById(id);

		if (!productExist) {
			return res.status(404).json({ msg: "data tidak ditemukan" });
		}

		// hapus gambar di folder uploads
		const filePath = path.join(
			__dirname,
			`../../uploads/${productExist.imageName}`,
		);

		await productExist.deleteOne();

		fs.unlink(filePath, (err) => {
			if (err) {
				console.log("gagal menghapus gambar", err);
				return;
			}
			console.log("berhasil menghapus gambar");
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
