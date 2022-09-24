const express = require('express');
const router = express.Router();

const {register, login, verifyEmail, forgotPassword, resetPassword, resendPasswordToken, resendVerificationToken} = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/resend-password-token', resendPasswordToken);
router.post('/resend-verification-token', resendVerificationToken);

module.exports = router;