import express from 'express'
import mongoose from "mongoose"
import Product from "../models/product.model.js"

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const products = await Product.find({})//kosong artinya kita mengambil semua data yang ada pada db
    res.status(200).json({success: true, data: products})
  } catch (e) {
    console.log("terjadi error: " + e.message)
    res.status(500).json({success: false, message: "server error"})
  }
})

router.get('/my-product', async (req, res) => {
  if(req.session.userId){
    const products = await Product.find({ownerId: req.session.userId})
    res.json({
      message: 'hello id : ' + req.session.userId,
      data: products
    })
  }
  else {
    res.status(401).json({message: "login dulu wak"})
  }
})

router.post('/', async (req, res) => {
  const product = req.body

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
    res.status(201).json({success: true, data: newProduct})
  } catch (e) {
    console.log("terjadi error: " + e.message)
    res.status(500).json({success: false, messsage: "internal server error"})
  }
})

router.put('/:id', async (req, res) => {
  const {id} = req.params
  const newProduct = req.body
  
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