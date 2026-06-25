const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Attendance = require('../models/Attendance');
const Trainer = require('../models/Trainer'); // 👈 Trainer Model Import kiya

// 📊 GET DASHBOARD LIVE STATS (http://localhost:5000/api/stats)
router.get('/', async (req, res) => {
  const todayStr = new Date().toISOString().split('T')[0];

  try {
    const totalMembers = await User.countDocuments({ role: 'member' });
    const todayPresent = await Attendance.countDocuments({ date: todayStr, status: 'Present' });

    // 🏋️ Live Trainers count database se fetch kiya
    const totalTrainers = await Trainer.countDocuments();

    const paidMembersData = await User.find({ role: 'member', feeStatus: 'Paid' });
    const totalLiveRevenue = paidMembersData.reduce((sum, member) => sum + (member.planPrice || 1000), 0);

    let attendanceRate = '0%';
    if (totalMembers > 0) {
      attendanceRate = `${Math.round((todayPresent / totalMembers) * 100)}%`;
    }

    res.json({
      activeMembers: totalMembers,
      trainersOnDuty: totalTrainers, // 👈 Ab yeh real database count ho gaya!
      attendanceRate: attendanceRate,
      todayCheckedInCount: todayPresent,
      monthlyRevenue: `₹${totalLiveRevenue.toLocaleString('en-IN')}`
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error fetching stats" });
  }
});

module.exports = router;
