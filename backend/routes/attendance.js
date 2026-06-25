const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const User = require('../models/User');

// 📅 1. GET TODAY'S ATTENDANCE LOGS (http://localhost:5000/api/attendance/today)
router.get('/today', async (req, res) => {
  const todayStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  try {
    const logs = await Attendance.find({ date: todayStr });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching attendance logs" });
  }
});

// ✍️ 2. MARK ATTENDANCE / CHECK-IN (http://localhost:5000/api/attendance/checkin)
router.post('/checkin', async (req, res) => {
  const { memberId, status } = req.body;
  const todayStr = new Date().toISOString().split('T')[0];

  try {
    // Check karein ki user exists hai ya nahi
    const member = await User.findById(memberId);
    if (!member) return res.status(404).json({ message: "Member not found" });

    // Check karein ki aaj ki attendance pehle se toh mark nahi hai
    const existingLog = await Attendance.findOne({ memberId, date: todayStr });
    if (existingLog) return res.status(400).json({ message: "Attendance already marked for today!" });

    const newAttendance = new Attendance({
      memberId,
      memberName: member.name,
      date: todayStr,
      status: status || 'Present'
    });

    await newAttendance.save();
    res.json({ message: "Check-in successful! 📅", log: newAttendance });
  } catch (error) {
    res.status(500).json({ message: "Error saving attendance" });
  }
});

module.exports = router;
