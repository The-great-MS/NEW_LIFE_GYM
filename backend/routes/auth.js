const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 🔑 1. REGISTER AUTH ENDPOINT
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // Strict validation checks
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Mandatory fields missing: Name, Email, Password' });
    }

    // Check duplicate index profiles
    const userExists = await User.findOne({ email: email.toLowerCase().trim() });
    if (userExists) {
      return res.status(400).json({ message: 'This email is already registered in our system.' });
    }

    // Secure password hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save structure configuration variables
    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      phone: phone || '',
      role: role || 'admin', // Owner dashboard access bypass default
      planType: 'Monthly',
      feeStatus: role === 'admin' ? 'Paid' : 'Pending',
      planPrice: 1000
    });

    await newUser.save();
    return res.status(200).json({ success: true, message: 'User registered successfully! 🎉' });

  } catch (error) {
    console.error("Database Registration Crash Log:", error);
    return res.status(500).json({ message: 'Internal Server Error during account sync.' });
  }
});

// 🔑 2. LOGIN AUTH ENDPOINT
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide both Email and Password' });
    }

    // Lookup tracking identity records
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(400).json({ message: 'Invalid Credentials. Email not found.' });
    }

    // Match encrypted keys hashes
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Credentials. Incorrect Password.' });
    }

    // Standard static token signing key configurations fallback
    const token = jwt.sign(
      { id: user._id, role: user.role },
      'secret_gym_token_key',
      { expiresIn: '1d' }
    );

    return res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Database Login Crash Log:", error);
    return res.status(500).json({ message: 'Internal Server Error during validation processing.' });
  }
});

module.exports = router;
