const mongoose = require('mongoose')

const pushupSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    pushups: {
      type: Number,
      required: true,
      min: [1, 'Must be at least 1'],
      validate: {
        validator: Number.isInteger,
        message : 'Must be an integer'
      }
    },
    day: {
      type: Date,
      required: true
    }
  },
  {
    timestamps: true
  }
)

const Pushup = mongoose.model('Pushup',pushupSchema)

module.exports = Pushup