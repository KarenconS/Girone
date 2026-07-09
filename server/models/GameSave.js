import mongoose from 'mongoose'

const gameSaveSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  currentCircle: { type: Number, default: 0 }, // 0 = Vestíbulo
  checkpoints: [String],
  deaths: { type: Number, default: 0 },
}, { timestamps: true })

export default mongoose.model('GameSave', gameSaveSchema)