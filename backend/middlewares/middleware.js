import jwt from 'jsonwebtoken'

// middleware untuk mengecek apakah request memiliki token yang valid atau tidak
export function validationToken(req, res, next) {
  const {authorization} = req.headers

  if(!authorization){
    return res.status(401).json({message: "Token diperlukan"})
  }

  const token = authorization.split(' ')[1]

  try {
    const jwtDecoded = jwt.verify(token, process.env.JWT_SECRET)

    req.userData = jwtDecoded
  } catch (err) {
    return res.status(402).json({message: "Unauthorized"})
  }
  next()
}