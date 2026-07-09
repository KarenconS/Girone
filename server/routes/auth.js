import { Router } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const router = Router()

router.post('/register', async (req, res) => {
  const { username, password } = req.body
  const passwordHash = await bcrypt.hash(password, 10)
  const user = await User.create({ username, passwordHash })
  res.json({ id: user._id })
})

router.post('/login', async (req, res) => {
  const { username, password } = req.body
  const user = await User.findOne({ username })
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ error: 'Credenciales inválidas' })
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
  res.json({ token })
})

export default router