const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  memberName: { type: String, required: true },
  date: { type: String, required: true }, // Format: YYYY-MM-DD taaki ek din me ek hi attendance ho
  status: { type: String, enum: ['Present', 'Absent'], default: 'Present' },
  checkInTime: { type: String, default: () => new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) }
});

module.exports = mongoose.model('Attendance', AttendanceSchema);
