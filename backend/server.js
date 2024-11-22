// client/backend/server.js
const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const cabRoutes = require('./routes/cabRoutes');
const cors = require('cors');
require('dotenv').config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cabs', cabRoutes); // Register cab routes


const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Smart Cab backend listening on port ${PORT}`);
})
