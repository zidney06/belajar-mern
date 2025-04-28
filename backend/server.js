import express from "express"
import dotenv from 'dotenv'
import cors from 'cors'
import {connectDB} from './config/db.js'
import Product from './models/product.model.js'
import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'

dotenv.config()

const app = express()
const PORT = 3000

//penggunaan middleware cors agar saat dihit tidak menyebabkan error akses denied karena cors
app.use(cors())//dengan ini mengizinkan semua domain untuk mengakses endpoint
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
app.use('/api/product' , productRoutes)
app.use('/api/user' , userRoutes)

app.get('/', (req, res) => {
	res.send("request berhasil coy")
})

app.listen(PORT, () => {
	connectDB()
	console.log(`Aplikasi berjalan di http://localhost:${PORT}`)
})