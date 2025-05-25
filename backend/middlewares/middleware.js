import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import fs from "fs";

// middleware untuk mengecek apakah request memiliki token yang valid atau tidak
export function validationToken(req, res, next) {
	const { authorization } = req.headers;

	if (!authorization) {
		return res.status(401).json({ message: "Token diperlukan" });
	}

	const token = authorization.split(" ")[1];

	console.log(authorization);

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

// pastikan folder upload sudah ada
const uploadir = path.join(import.meta.dirname, "../uploads");

// cek apakah folder uploads sudah ada atau belum
if (!fs.existsSync(uploadir)) {
	fs.mkdirSync(uploadir);
}

// konfigurasi penyimpanan multer
export const storage = multer.diskStorage({
	destination: (req, res, cb) => {
		cb(null, uploadir);
	},
	filename: (req, file, cb) => {
		// beri nama unik pada file
		console.log(req.userData);
		if (req.session.data) {
			console.log(req.userData, "multer");
			const uniqueName =
				Date.now() + req.userData.id + path.extname(file.originalname);
			cb(null, uniqueName);
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
