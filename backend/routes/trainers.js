const express = require('express');
const router = express.Router();
const Trainer = require('../models/Trainer');

// 🏋️ 1. GET ALL TRAINERS (http://localhost:5000/api/trainers)
router.get('/', async (req, res) => {
  try {
    const trainers = await Trainer.find().sort({ joinedAt: -1 });
    res.json(trainers);
  } catch (error) {
    res.status(500).json({ message: "Server Error fetching trainers" });
  }
});

// 🏋️ 2. ADD NEW TRAINER (http://localhost:5000/api/trainers/add)
router.post('/add', async (req, res) => {
  const { name, specialization, phone, shift } = req.body;
  try {
    const newTrainer = new Trainer({ name, specialization, phone, shift });
    await newTrainer.save();
    res.json({ message: "Trainer registered successfully! 💪" });
  } catch (error) {
    res.status(500).json({ message: "Server Error adding trainer" });
  }
});

// 🏋️ 3. DELETE A TRAINER (http://localhost:5000/api/trainers/:id)
router.delete('/:id', async (req, res) => {
  try {
    await Trainer.findByIdAndDelete(req.params.id);
    res.json({ message: "Trainer removed from database successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server Error deleting trainer" });
  }
});

module.exports = router;
