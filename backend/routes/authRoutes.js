// client/backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchUser = require('../middleware/fetchUser');
const JWT_SECRET = 'IamPuneethKumarSunku$$21BCS215';

// Register user
router.post('/register',
  [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long'),
    body('name').isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { email, password, name } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: 'A user with this email already exists' });
      }

      const isAdmin = email === 'admin@gmail.com';

      user = new User({ email, password, name, isAdmin });
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();

      const payload = { userId: user._id, isAdmin: user.isAdmin };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

      res.json({ token });
    } catch (error) {
      res.status(500).json({ message: 'Server error. Please try again later.' });
    }
  }
);

// Login user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid Credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid Credentials' });

    const payload = { userId: user._id, isAdmin: user.isAdmin };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, isAdmin: user.isAdmin });
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

// Get user details
router.post('/getuser', fetchUser, async (req, res) => {
  try {
    const user = await User.findById(req.user).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

// Get traveller (user) name
router.get('/getUserName/:userId', async (req, res) => {
  try {
    const uId = req.params.userId;
    const userName = await User.findById(uId).select('name');
    res.json(userName);
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
