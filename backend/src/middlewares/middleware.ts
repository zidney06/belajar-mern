import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import fs from "fs";
import { NextFunction, Request, Response } from "express";
import { CustomJwtPayload } from "../types/express.d";
import BLToken from "../models/BLTokenModel";

export const validationToken = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return res.status(401).json({ msg: "Akses ditolak. Token tidak valid." });
	}

	const token = authHeader.split(" ")[1];

	try {
		const isBlacklisted = await BLToken.findOne({ token: token });

		if (isBlacklisted) {
			return res.status(401).json({ msg: "Token sudah diblokir." });
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET!);

		if (typeof decoded !== "string") {
			req.userData = decoded as CustomJwtPayload;
			next();
		} else {
			return res
				.status(401)
				.json({ msg: "Token tidak valid (Payload string)." });
		}
	} catch (error) {
		// Menangani error seperti token kedaluwarsa (TokenExpiredError) atau tidak valid
		return res.status(401).json({ msg: "Token tidak valid atau kedaluwarsa." });
	}
};

/*
Hal baru: salah satu hal yang membuat operasi I / O file lambat saat ,engggunakan multer
kemungkinan besar adalah interupsi dari antivirus. setelah mengecualikan folder tempat
di mana file dismpan, pemrosesan dapatberjalan dengan cepat
*/

// pastikan folder upload sudah ada
const uploadir = path.join(__dirname, "../../uploads");

// cek apakah folder uploads sudah ada atau belum
if (!fs.existsSync(uploadir)) {
	fs.mkdirSync(uploadir);
}

// konfigurasi penyimpanan multer
export const storage = multer.diskStorage({
	destination: (req, res, cb) => {
		return cb(null, uploadir);
	},
	filename: (req, file, cb) => {
		if (req.userData) {
			const uniqueName =
				Date.now() + req.userData.id + path.extname(file.originalname);
			return cb(null, uniqueName);
		}
	},
});

export const validationSession = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const userData = req.session.data;

	// cek apakah user memiliki sesi atau tidak
	if (!userData) {
		return res.status(401).json({ message: "Sesi anda tidak valid" });
	}

	next();
};
