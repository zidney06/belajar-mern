import express from 'express'
import mongoose from 'mongoose'
import User from '../models/userModel.js'

const router = express.Router()

router.post('/register', async (req, res) => {
  const {username, email, password} = req.body

  console.log(username, email, password)

  if(!username, !email, !password){
    return res.status(403).json({ message: "lengkapi datanya dulu!" })
  }

  const newUser = new User({
    username: username,
    email: email,
    password: password
  })

  try {
    // simpan data user baru ke DB
    await newUser.save()
    res.status(201).json({success: true, data : {
      username: username,
      email: email,
      password: password
    }})
  } catch (err) {
    console.error(err.message)
    res.status(500).json({success: false, messsage: "internal server error"})
  }
})
router.post('/login', async (req, res) => {
  const user = req.body

  try {
    // cari apakah user ada di DB atau tidak
    const userInDB = await User.findOne({email: user.email})

    // kalau gak ada maka respon = 404
    if(!userInDB){
      return res.status(404).json({message: `User dengan email ${user.email} tidak ditemukan`})
    }

    // cek apakah password benar atau tidak
    if(user.password === userInDB.password){
      return res.status(200).json({message: "user ditemukan dan berhasil login"})
    } else {
      return res.status(401).json({message: "password salah"})
    }

  } catch (err) {
    console.error(err.message)
    res.status(500).json({success: false, messsage: "internal server error"})
  }
})

// router.post('/', async (req, res) => {

// })

// router.put('/:id', async (req, res) => {

// })

// router.delete('/:id', async (req, res) => {

// })

export default router