const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/stats', require('./routes/stats'));
app.use('/api/members', require('./routes/members'));
app.use('/api/trainers', require('./routes/trainers'));
app.use('/api/attendance', require('./routes/attendance'));

// MongoDB Connection
const uri = process.env.MONGO_URI;
mongoose.connect(uri)
  .then(() => console.log("MongoDB Database Connected Successfully! 🍃"))
  .catch(err => console.log("Database Connection Error: ", err));

app.get('/', (req, res) => {
  res.send('Green Gym Backend Server Running Successfully!');
});

app.listen(PORT, () => {
  console.log(`Server is happily running on port: ${PORT}`);
});
