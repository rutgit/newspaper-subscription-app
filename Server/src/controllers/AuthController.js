import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

export const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'כל השדות חובה' })
  }

  const foundUser = await User.findOne({ email }).lean()
  if (!foundUser) {
    return res.status(401).json({ message: 'לא מורשה' })
  }

  const match = await bcrypt.compare(password, foundUser.password)
  if (!match) {
    return res.status(401).json({ message: 'לא מורשה' })
  }
console.log(foundUser.isAdmin);

  const userInfo = {
    id: foundUser._id,
    email: foundUser.email,
    isAdmin: foundUser.isAdmin
  }

  const accessToken = jwt.sign(
    userInfo,
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "7d" }
  )

  res.json({ accessToken })
}

export const register = async (req, res) => {
  const { fullName, email, password,isAdmin, address, subscription } = req.body

  if (!fullName || !password || !email) {
    return res.status(400).json({ message: 'כל השדות חובה' })
  }

  const duplicateEmail = await User.findOne({ email }).lean()
  if (duplicateEmail) {
    return res.status(409).json({ message: 'כפילות משתמשים' })
  }
  const duplicatePass = await User.findOne({ password }).lean()
  if (duplicatePass) {
    return res.status(409).json({ message: 'כפילות משתמשים' })
  }
  const hashedPwd = await bcrypt.hash(password, 10)

  const user = await User.create({
    fullName,
    email,
    password: hashedPwd,
    address,
    subscription,
    isAdmin
  })

  return res.status(201).json({
    message: `נוצר משתמש חדש: ${user.fullName}`
  })
}
