import express from 'express'
import mongoose from "mongoose"
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import Product from "../models/product.model.js"
import {validationToken} from '../middlewares/middleware.js'

// pastikan folder upload sudah ada
const uploadir = path.join(import.meta.dirname, '../uploads')

if (!fs.existsSync(uploadir)){
  fs.mkdirSync(uploadir)
}

// konfigurasi penyimpanan multer
const storage = multer.diskStorage({
  destination: (req,res, cb) => {
    cb(null, uploadir)
  },
  filename: (req, file, cb) => {
    // beri nama unik pada file
    console.log(req.session.data)
    if(req.session.data){
      console.log(req.session.data, 'multer')
      const uniqueName = Date.now() + req.session.data.id + path.extname(file.originalname)
      cb(null, uniqueName)
    } else {
      cb(null, file.originalname)
    }
  }
})

const upload = multer({storage})

const router = express.Router()

// cek dulu apakah request memiliki token atau tidak
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({})//kosong artinya kita mengambil semua data yang ada pada db

    res.status(200).json({success: true, data: products})
  } catch (e) {
    console.log("terjadi error: " + e.message)
    res.status(500).json({success: false, message: "server error"})
  }
})

// protected route
router.get('/my-product', validationToken, async (req, res) => {
  const userData = req.session.data
  if(userData){
    const products = await Product.find({ownerId: userData.id})
    res.json({
      message: 'hello: ' + userData.username,
      data: products
    })
  }
  else {
    res.status(401).json({message: "login dulu wak"})
  }
})

router.post('/', upload.single('file'), async (req, res) => {
  const userData = req.session.data
  
  // cek apakah user memiliki sesi atau tidak
  if(!userData){
    res.status(401).json({message: "Sesi anda telah habis"})
  }

  // cek apakah user mengirimkan file atau tidak
  if(!req.file){
    console.log(req.body)
    return res.status(400).json({message: 'no file uploaded'})
  }

  const product = JSON.parse(req.body.data)

  product.image = `http://localhost:3000/folder/fotos/${req.file.filename}`

  console.log(product)
  
  if(!product.author ||
    !product.price ||
    !product.image ||
    !product.title ||
    !product.ISBN){
    return res.status(403).json({success: false, message: "tolong masukan data dengan benar"})
  }
  
  const newProduct = new Product(product)
  
  try {
    await newProduct.save()
    res.status(201).json({
      success: true, 
      data: newProduct,
      filename: req.file.filename,
      path: `../uploads/files/${req.file.filename}`
    })
  } catch (e) {
    console.log("terjadi error: " + e.message)
    res.status(500).json({success: false, messsage: "internal server error"})
  }
})

router.put('/:id', upload.single('file'), async (req, res) => {
  const {id} = req.params

  const userData = req.session.data
  
  // cek apakah user memiliki sesi atau tidak
  if(!userData){
    return res.status(401).json({message: "Sesi anda telah habis"})
  }

  // cek apakah user mengirimkan file atau tidak
  if(!req.file){
    console.log('tidak ada file')

    const newProduct = JSON.parse(req.body.data)

    console.log(newProduct)
    
    if(!mongoose.Types.ObjectId.isValid(id)){
      return res.status(404).json({succesa: false, message: "data tidak ditemukan"})
    }
    
    try {
      const updatedProduct = await Product.findByIdAndUpdate(id, newProduct, {new: true})
      res.status(201).json({success: true, data: updatedProduct})
    } catch (e) {
      console.log("terjadi error: " + e.message)
      res.status(500).json({success: false, messsage: "internal server error"})
    }
  } else {
    const newProduct = JSON.parse(req.body.data)

    newProduct.image = `http://localhost:3000/folder/fotos/${req.file.filename}`

    console.log(newProduct, req.file)
    
    if(!mongoose.Types.ObjectId.isValid(id)){
      return res.status(404).json({succesa: false, message: "data tidak ditemukan"})
    }
    
    try {
      const updatedProduct = await Product.findByIdAndUpdate(id, newProduct, {new: true})
      res.status(201).json({success: true, data: updatedProduct})
    } catch (e) {
      console.log("terjadi error: " + e.message)
      res.status(500).json({success: false, messsage: "internal server error"})
    }
  }
  
})

router.delete('/:id', async (req, res) => {
  const {id} = req.params
  console.log(id)
  try {
    await Product.findByIdAndDelete(id)
    res.status(200).json({success: true, message: "data berhasil dihapus"})
  } catch (e) {
    console.log("error: " + e.message)
    res.status(404).json({success: false, message: "data tidak ditemukan"})
  }
})

export default router