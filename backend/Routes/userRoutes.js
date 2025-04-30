import express from 'express'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import User from '../models/userModel.js'

const router = express.Router()


router.post('/register', async (req, res) => {
  const user = req.body
  const salt = await bcrypt.genSalt(10)

  console.log(user.username, user.email, user.password)

  if(!user.username, !user.email, !user.password){
    return res.status(403).json({ message: "lengkapi datanya dulu!" })
  }

  user.password = await bcrypt.hash(user.password, salt)

  const newUser = new User({
    username: user.username,
    email: user.email,
    password: user.password
  })

  try {
    // simpan data user baru ke DB
    await newUser.save()

    res.status(201).json({success: true, data : {
      username: user.username,
      email: user.email,
      password: user.password
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

    const isMatch = await bcrypt.compare(user.password, userInDB.password)

    // cek apakah password benar atau tidak
    if(isMatch){
      // membuat id session
      req.session.userId = userInDB._id // berarti yang disimpan itu ini
      console.log(req.session)
      return res.status(200).json({message: "user ditemukan dan berhasil login"})
    } else {
      return res.status(401).json({message: "password salah"})
    }

  } catch (err) {
    console.error(err.message)
    res.status(500).json({success: false, message: "internal server error"})
  }
})
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if(err){
      return res.status(500).json({message: "gagal logout"})
    }
    res.json({message: "berhasil logout"})
  })
})
router.get('/account', (req, res) => {
  if(req.session.userId){
    res.json({
      message: 'hello id : ' + req.session.userId,
      data: {
        nama: "bakso",
        uang: 12000000
      }
    })
  }
  else {
    res.status(401).json({message: "login dulu wak"})
  }
})

export default router