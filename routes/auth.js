const express = require('express');
const rateLimit = require('express-rate-limit');
const { signup, verifyOtp, login } = require('../controllers/authController');

const router = express.Router();

// Simple login rate limiter
const loginLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 20,
	standardHeaders: true,
	legacyHeaders: false,
});

// Signup
router.post('/signup', signup);

// Verify OTP
router.post('/verify-otp', verifyOtp);

// Login
router.post('/login', loginLimiter, login);

module.exports = router;
