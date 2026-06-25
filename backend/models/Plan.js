const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "Monthly Basic", "Yearly Pro"
  durationInMonths: { type: Number, required: true },
  price: { type: Number, required: true }
});

module.exports = mongoose.model('Plan', planSchema);
