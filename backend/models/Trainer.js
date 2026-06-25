const mongoose = require('mongoose');

const TrainerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialization: { type: String, required: true }, // e.g., Bodybuilding, Cardio, Yoga
  phone: { type: String, required: true },
  shift: { type: String, required: true }, // e.g., Morning (6 AM - 12 PM), Evening
  joinedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Trainer', TrainerSchema);
