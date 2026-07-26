const express = require('express');
const { register, verifyOTP, resendOTP, login, createUser, forgotPassword, resetPassword, getMe, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');
const { loginLimiter, passwordResetLimiter } = require('../middleware/rateLimiter');
const { validate, loginRules, registerRules, createUserRules } = require('../middleware/validate');
const { uploadProfile } = require('../middleware/upload');
const User = require('../models/User');
const cloudinary = require('../config/cloudinary');
const router = express.Router();

router.post('/register', registerRules, validate, register);
router.post('/login', loginLimiter, loginRules, validate, login);
router.post('/forgot-password', passwordResetLimiter, forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/verify-otp', protect, verifyOTP);
router.post('/resend-otp', protect, resendOTP);
router.post('/create-user', protect, authorize('admin'), createUser);

// Avatar upload
router.put('/profile/avatar', protect, uploadProfile.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const user = await User.findByIdAndUpdate(req.user._id, { avatar: req.file.path }, { new: true }).select('-password');
    res.json({ url: req.file.path, user });
  } catch (error) { res.status(500).json({ message: 'Upload failed' }); }
});

// Avatar remove
router.delete('/profile/avatar', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.avatar) {
      const publicId = user.avatar.split('/').slice(-2).join('/').split('.')[0];
      await cloudinary.uploader.destroy(publicId).catch(() => {});
    }
    user.avatar = '';
    await user.save();
    res.json({ message: 'Avatar removed' });
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;
