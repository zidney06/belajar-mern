import express from 'express'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'


const router = express.Router()

// const validationToken = (req, res, next) => {
//   const {authorization} = req.headers

//   if(!authorization){
//     return res.status(401).json({message: "Token diperlukan"})
//   }

//   const token = authorization.split(' ')[1]

//   try {
//     const jwtDecoded = jwt.verify(token, process.env.JWT_SECRET)

//     req.userData = jwtDecoded
//   } catch (err) {
//     return res.status(402).json({message: "Unauthorized"})
//   }
//   next()
// }

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

    res.status(201).json({
      success: true,
      message: "berhasil registrasi",
      data : {
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
  if(!req.body.email || !req.body.password){
    return res.status(403).json({ message: "lengkapi datanya dulu!" })
  }
  try {
    // cari apakah user ada di DB atau tidak
    const user = await User.findOne({email: req.body.email})

    // kalau gak ada maka respon = 404
    if(!user){
      return res.status(404).json({message: `User dengan email ${req.body.email} tidak ditemukan`})
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password)

    // cek apakah password benar atau tidak
    if(isMatch){
      // membuat id session
      req.session.userId = user._id // berarti yang disimpan itu ini
      req.session.save(err => {
        if(err){
          console.log('e', err)
        }
      })
      console.log('login' ,req.session)

      // membuat autentikasi menggunakan jsonwebtoken
      const payload = {
        id: user._id,
        username: user.username,
        email: user.email
      }
      const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 1})
      return res.status(200).json({
        message: "user ditemukan dan berhasil login",
        data: {
          username: user.username,
          email: user.email,
          _id: user._id  
        },
        token: token
      })
    } else {
      return res.status(401).json({message: "password salah"})
    }

  } catch (err) {
    console.error(err.message)
    res.status(500).json({success: false, message: "internal server error"})
  }
})

router.post('/logout', (req, res) => {
  console.log('logout: ', req.session)
  req.session.destroy(err => {
    if(err){
      return res.status(500).json({message: "gagal logout"})
    }
    res.clearCookie('connect.sid')
    res.json({message: "berhasil logout"})
  })
})

router.get('/account', (req, res) => {
  console.log('account: ', req.session)
  if(req.session.userId){
    res.json({
      message: 'hello id : ' + req.session.userId
    })
  }
  else {
    res.status(401).json({message: "login dulu wak"})
  }
})

export default router