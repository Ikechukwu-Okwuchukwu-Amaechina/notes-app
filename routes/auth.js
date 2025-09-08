const express = require('express');
const { signup, verifyOtp, login } = require('../controllers/authController');

const router = express.Router();

// Signup
router.post('/signup', signup);

// Verify OTP
router.post('/verify-otp', verifyOtp);

// Login
router.post('/login', login);

module.exports = router;
