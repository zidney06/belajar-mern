import express from "express"
import dotenv from 'dotenv'
import {connectDB} from './config/db.js'
import Product from './models/product.model.js'
import productRoutes from './routes/productRoutes.js'

dotenv.config()

const app = express()
const PORT = 3000

app.use(express.json())
app.use('/api/product' ,productRoutes)

app.get('/', (req, res) => {
	res.send("request berhasil coy")
})

app.listen(PORT, () => {
	connectDB()
	console.log(`Aplikasi berjalan di http://localhost:${PORT}`)
})