const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { findByEmail, createUser, updateUser } = require('../models/userModel');

const router = express.Router();

// helper to generate OTP (simple 6-digit)
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Signup: name, email, phone, password
router.post('/signup', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body || {};
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: 'name, email, phone, password are required' });
    }
    const existing = findByEmail(email);
    if (existing) return res.status(409).json({ message: 'Email already in use' });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const otpCode = generateOtp();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes

    const user = createUser({ name, email, phone, passwordHash, otpCode, otpExpiresAt });

    // Bonus: Email OTP — in this simple version we just return it for demo
    // In real apps, send via email service like SendGrid, Nodemailer, etc.

    return res.status(201).json({
      message: 'Signup successful. Please verify OTP sent to your email.',
      // expose otp only for demo/testing; remove in production
      demoOtp: otpCode,
      userId: user.id,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

// Verify OTP
router.post('/verify-otp', (req, res) => {
  try {
    const { email, otp } = req.body || {};
    if (!email || !otp) return res.status(400).json({ message: 'email and otp are required' });

    const user = findByEmail(email);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.otpCode || !user.otpExpiresAt) {
      return res.status(400).json({ message: 'No OTP to verify' });
    }

    const now = Date.now();
    const expires = new Date(user.otpExpiresAt).getTime();
    if (now > expires) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    if (user.otpCode !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    user.isVerified = true;
    user.otpCode = null;
    user.otpExpiresAt = null;
    updateUser(user);

    return res.json({ message: 'Email verified successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

// Login: email, password — returns JWT
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: 'email and password are required' });

    const user = findByEmail(email);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    if (!user.isVerified) {
      return res.status(403).json({ message: 'Email not verified' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' });
    return res.json({ token });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
