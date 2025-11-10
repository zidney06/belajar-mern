import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db";
import productRoutes from "./routes/productRoutes";
import userRoutes from "./routes/userRoutes";
import rateLimit from "express-rate-limit";

dotenv.config();

const app: express.Express = express();
const PORT = 3000;

//penggunaan middleware cors agar saat dihit tidak menyebabkan error akses denied karena cors
app.use(cors({ origin: "http://localhost:5173", credentials: true })); //dengan ini mengizinkan semua domain untuk mengakses endpoint
// app.use(cors({origin: 'http://localhost:5173'}))
/*
jika ingin hanya origin tertentu saja
app.use(cors({origin: 'url', optionSucessStatus: 200}))

jika hanya untuk rute tertentu saja
app.get('/spesial', cors({origin: 'url', optionSucessStatus: 200}), (req, res) => {
	res.json({msg: 'cors diperbolehkan untuk rute ini saja'})
})
*/
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true })); // digunakan agar dapat mengkases data yang diirimkan di body request dengan req.body
app.use(
	session({
		secret: process.env.SESSION_SECRET!,
		resave: false, // jika true session disimpan ke penyimpanan pada setiap request walaupun tidak dimodifikasi
		saveUninitialized: false,
		// secara default session akan tetap ada hingga server disertart
		// jika ingin memberikan expired pada session maka pakai ini
		cookie: {
			maxAge: 1000 * 60 * 30,
		}, // dengan ini session akan expired dalam, satu jam (ini pakai milisecond)
	}),
);
// limit request
const limiter = rateLimit({
	windowMs: 1 * 60 * 1000,
	max: 100,
	standardHeaders: true,
	message: "Too many requests from this IP, please try again later!",
});

// production
if (process.env.NODE_ENV === "production") {
	app.use("/folder/fotos", express.static(path.join(__dirname, "../uploads")));
	app.use(express.static(path.join(__dirname, "../../frontend/dist")));

	app.get("/", (req: Request, res: Response) => {
		res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
	});
} else {
	app.use("/folder/fotos", express.static(path.join(__dirname, "../uploads")));
	app.get("/", (req: Request, res: Response) => {
		console.log("Pengunjung");
		res.send("Selamat datang!");
	});
}

// Membuat folder 'uploads' dapat diakses melalui URL
// Misalnya, jika ada file 'gambar.jpg' di dalam folder 'uploads',
// maka dapat diakses melalui URL: http://localhost:3000/fotos/gambar.jpg
app.use("/folder/fotos", express.static(path.join(__dirname, "uploads")));

app.use("/api/product", limiter, productRoutes);
app.use("/api/user", limiter, userRoutes);

console.log("coy");

app.get("*", (req: Request, res: Response) => {
	res.status(404).send("<h1>Page Not Found on the Server</h1>");
});

app.listen(PORT, () => {
	connectDB();
	console.log(`Aplikasi berjalan di http://localhost:${PORT}`);
});
