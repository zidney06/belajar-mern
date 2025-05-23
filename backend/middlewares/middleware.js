import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";

// middleware untuk mengecek apakah request memiliki token yang valid atau tidak
export function validationToken(req, res, next) {
	const { authorization } = req.headers;

	if (!authorization) {
		return res.status(401).json({ message: "Token diperlukan" });
	}

	const token = authorization.split(" ")[1];

	try {
		const jwtDecoded = jwt.verify(token, process.env.JWT_SECRET);

		req.userData = jwtDecoded;
	} catch (err) {
		return res.status(402).json({ message: "Unauthorized" });
	}
	next();
}

// konfigurasi penyimpanan multer
export const storage = multer.diskStorage({
	destination: (req, res, cb) => {
		cb(null, uploadir);
	},
	filename: (req, file, cb) => {
		// beri nama unik pada file
		console.log(req.session.data);
		if (req.session.data) {
			console.log(req.session.data, "multer");
			const uniqueName =
				Date.now() + req.session.data.id + path.extname(file.originalname);
			cb(null, uniqueName);
		} else {
			cb(null, file.originalname);
		}
	},
});

export const sessionValidation = (req, res, next) => {
	const userData = req.session.data;

	// cek apakah user memiliki sesi atau tidak
	if (!userData) {
		res.status(401).json({ message: "Sesi anda telah habis" });
	}
};
