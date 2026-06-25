const express = require('express');
const router = express.Router();
const User = require('../models/User');

// 👥 1. GET ALL MEMBERS (http://localhost:5000/api/members)
router.get('/', async (req, res) => {
  try {
    // Database se sirf un users ko nikalo jinka role 'member' hai
    const members = await User.find({ role: 'member' }).sort({ joinedAt: -1 });
    res.json(members);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error fetching members list" });
  }
});

// 🗑️ 2. DELETE A MEMBER (http://localhost:5000/api/members/:id)
router.delete('/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Member removed from the gym database successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error deleting member" });
  }
});

// 💰 3. UPDATE MEMBER FEE STATUS & PLAN TIER (http://localhost:5000/api/members/fee-status/:id)
router.put('/fee-status/:id', async (req, res) => {
  const { feeStatus, planType } = req.body;

  // Plan ke hisab se price automatic set hoga
  let planPrice = 1000;
  if (planType === 'Quarterly') planPrice = 2500;
  if (planType === 'Yearly') planPrice = 8000;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { feeStatus, planType, planPrice },
      { new: true }
    );
    res.json({ message: "Subscription Plan Updated Successfully! 💰", updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error updating subscription details" });
  }
});

module.exports = router;
