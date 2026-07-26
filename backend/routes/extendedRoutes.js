const express = require('express');
const router = express.Router();
const Loan = require('../models/Loan');
const OnlineClass = require('../models/OnlineClass');
const IDCard = require('../models/IDCard');
const Campus = require('../models/Campus');
const NotificationHistory = require('../models/NotificationHistory');
const { protect } = require('../middleware/auth');

// Loans
router.get('/loans', protect, async (req, res) => { try { res.json(await Loan.find({ schoolId: req.user.schoolId })); } catch { res.status(500).json({ message: 'Server error' }); } });
router.post('/loans', protect, async (req, res) => {
  try { const loan = await Loan.create({ ...req.body, remainingAmount: req.body.amount, schoolId: req.user.schoolId }); res.status(201).json(loan); }
  catch { res.status(500).json({ message: 'Server error' }); }
});

// Online Classes
router.get('/online-classes', protect, async (req, res) => { try { res.json(await OnlineClass.find({ schoolId: req.user.schoolId }).sort({ date: 1 })); } catch { res.status(500).json({ message: 'Server error' }); } });
router.post('/online-classes', protect, async (req, res) => { try { res.status(201).json(await OnlineClass.create({ ...req.body, schoolId: req.user.schoolId })); } catch { res.status(500).json({ message: 'Server error' }); } });

// ID Cards
router.get('/id-cards', protect, async (req, res) => { try { res.json(await IDCard.find({ schoolId: req.user.schoolId })); } catch { res.status(500).json({ message: 'Server error' }); } });
router.post('/id-cards', protect, async (req, res) => { try { res.status(201).json(await IDCard.create({ ...req.body, schoolId: req.user.schoolId })); } catch { res.status(500).json({ message: 'Server error' }); } });

// Campuses
router.get('/campuses', protect, async (req, res) => { try { res.json(await Campus.find({ schoolId: req.user.schoolId })); } catch { res.status(500).json({ message: 'Server error' }); } });
router.post('/campuses', protect, async (req, res) => { try { res.status(201).json(await Campus.create({ ...req.body, schoolId: req.user.schoolId })); } catch { res.status(500).json({ message: 'Server error' }); } });

// Notification History
router.get('/notification-history', protect, async (req, res) => { try { res.json(await NotificationHistory.find({ schoolId: req.user.schoolId }).sort({ createdAt: -1 }).limit(100).populate('sentBy', 'name')); } catch { res.status(500).json({ message: 'Server error' }); } });
router.post('/notification-history', protect, async (req, res) => { try { res.status(201).json(await NotificationHistory.create({ ...req.body, schoolId: req.user.schoolId, sentBy: req.user._id })); } catch { res.status(500).json({ message: 'Server error' }); } });

module.exports = router;
