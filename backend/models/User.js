const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  role: { type: String, enum: ['admin', 'member'], default: 'member' },
  // 💰 Fee Management Fields
  planType: { type: String, enum: ['Monthly', 'Quarterly', 'Yearly'], default: 'Monthly' },
  feeStatus: { type: String, enum: ['Paid', 'Pending'], default: 'Pending' },
  planPrice: { type: Number, default: 1000 }, // Default ₹1000 for Monthly pack
  joinedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
