import { Router } from 'express'
import GameSave from '../models/GameSave.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()

router.post('/save', authMiddleware, async (req, res) => {
  const save = await GameSave.findOneAndUpdate(
    { userId: req.userId },
    { ...req.body, userId: req.userId },
    { upsert: true, new: true }
  )
  res.json(save)
})

router.get('/', authMiddleware, async (req, res) => {
  const save = await GameSave.findOne({ userId: req.userId })
  res.json(save || { currentCircle: 0 })
})

export default router