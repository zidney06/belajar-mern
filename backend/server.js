import express from "express"
import dotenv from 'dotenv'
import cors from 'cors'
import bodyParser from 'body-parser'
import session from 'express-session'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import {fileURLToPath} from 'url'
import {connectDB} from './config/db.js'
import Product from './models/product.model.js'
import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'

dotenv.config()

const app = express()
const PORT = 3000



//penggunaan middleware cors agar saat dihit tidak menyebabkan error akses denied karena cors
app.use(cors({origin: 'http://localhost:5173', credentials: true}))//dengan ini mengizinkan semua domain untuk mengakses endpoint
// app.use(cors({origin: 'http://localhost:5173'}))
/*
jika ingin hanya origin tertentu saja
app.use(cors({origin: 'url', optionSucessStatus: 200}))

jika hanya untuk rute tertentu saja
app.get('/spesial', cors({origin: 'url', optionSucessStatus: 200}), (req, res) => {
	res.json({msg: 'cors diperbolehkan untuk rute ini saja'})
})
*/
app.use(express.json())
app.use(bodyParser.urlencoded({extended: true})) // digunakan agar dapat mengkases data yang diirimkan di body request dengan req.body
app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: false,// jika true session disimpan ke penyimpanan pada setiap request walaupun tidak dimodifikasi
	saveUninitialized: false,
	// secara default session akan tetap ada hingga server disertart
	// jika ingin memberikan expired pada session maka pakai ini
	cookie: {
		maxAge: 1000 * 60 * 30
	} // dengan ini session akan expired dalam, satu jam (ini pakai milisecond)
}))

// Mendapatkan direktori saat ini menggunakan ES module syntax
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Membuat folder 'uploads' dapat diakses melalui URL
// Misalnya, jika ada file 'gambar.jpg' di dalam folder 'uploads',
// maka dapat diakses melalui URL: http://localhost:3000/fotos/gambar.jpg
app.use('/folder/fotos', express.static(path.join(__dirname, 'uploads')));

app.use('/api/product' , productRoutes)
app.use('/api/user' , userRoutes)

app.get('/', (req, res) => {
	res.send("request berhasil coy")
})

app.listen(PORT, () => {
	connectDB()
	console.log(`Aplikasi berjalan di http://localhost:${PORT}`)
})