import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import 'dotenv/config'
import authRoutes from './routes/auth.js'
import progressRoutes from './routes/progress.js'

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('/api/progress', progressRoutes)

mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(process.env.PORT, () => console.log(`Servidor en puerto ${process.env.PORT}`)))
  .catch(console.error)