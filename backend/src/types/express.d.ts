import { Request } from "express";
import { SessionData } from "express-session";
import { JwtPayload } from "jsonwebtoken";

interface CustomJwtPayload extends JwtPayload {
	id: string;
	email: string;
	username: string;
}

// Perluas tipe Request
declare module "express-serve-static-core" {
	interface Request {
		userData?: JwtPayload;
		data?: any;
	}
}

declare module "express-session" {
	interface SessionData {
		// Tambahkan properti 'data' ke dalam SessionData
		data?: any;
	}
}
