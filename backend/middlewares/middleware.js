import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import fs from "fs";

// middleware untuk mengecek apakah request memiliki token yang valid atau tidak
export function validationToken(req, res, next) {
	const { authorization } = req.headers;

	if (!authorization) {
		return res
			.status(401)
			.json({ msg: "Token diperlukan. Harap login terlebih dahulu." });
	}

	const token = authorization.split(" ")[1];

	if (!token || token === "null" || token === "undefined") {
		return res
			.status(401)
			.json({ msg: "Token diperlukan Harap login terlebih dahulu." });
	}

	try {
		const jwtDecoded = jwt.verify(token, process.env.JWT_SECRET);

		if (jwtDecoded) {
			req.userData = jwtDecoded;
		}
	} catch (err) {
		console.log(err);
		return res.status(401).json({ message: "Unauthorized" });
	}
	next();
}

/*
Hal baru: salah satu hal yang membuat operasi I / O file lambat saat ,engggunakan multer
kemungkinan besar adalah interupsi dari antivirus. setelah mengecualikan folder tempat
di mana file dismpan, pemrosesan dapatberjalan dengan cepat
*/

// pastikan folder upload sudah ada
const uploadir = path.join(import.meta.dirname, "../uploads");

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

export const validationSession = (req, res, next) => {
	const userData = req.session.data;

	// cek apakah user memiliki sesi atau tidak
	if (!userData) {
		return res.status(401).json({ message: "Sesi anda tidak valid" });
	}

	next();
};
