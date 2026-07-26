const express = require('express');
const router = express.Router();
const Certificate = require('../models/Certificate');
const Complaint = require('../models/Complaint');
const SMSTemplate = require('../models/SMSTemplate');
const { protect } = require('../middleware/auth');

// Certificates
router.get('/certificates', protect, async (req, res) => {
  try { res.json(await Certificate.find({ schoolId: req.user.schoolId }).populate('studentId').sort({ createdAt: -1 })); }
  catch (error) { res.status(500).json({ message: 'Server error' }); }
});
router.post('/certificates', protect, async (req, res) => {
  try { res.status(201).json(await Certificate.create({ ...req.body, schoolId: req.user.schoolId, issuedBy: req.user._id })); }
  catch (error) { res.status(500).json({ message: 'Server error' }); }
});

// Complaints
router.get('/complaints', protect, async (req, res) => {
  try { res.json(await Complaint.find({ schoolId: req.user.schoolId }).populate('submittedBy','name').sort({ createdAt: -1 })); }
  catch (error) { res.status(500).json({ message: 'Server error' }); }
});
router.put('/complaints/:id', protect, async (req, res) => {
  try {
    const c = await Complaint.findByIdAndUpdate(req.params.id, { ...req.body, resolvedBy: req.user._id }, { new: true });
    res.json(c);
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
});

// SMS Templates
router.get('/sms-templates', protect, async (req, res) => {
  try { res.json(await SMSTemplate.find({ schoolId: req.user.schoolId })); }
  catch (error) { res.status(500).json({ message: 'Server error' }); }
});
router.post('/sms-templates', protect, async (req, res) => {
  try { res.status(201).json(await SMSTemplate.create({ ...req.body, schoolId: req.user.schoolId })); }
  catch (error) { res.status(500).json({ message: 'Server error' }); }
});
router.delete('/sms-templates/:id', protect, async (req, res) => {
  try { await SMSTemplate.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); }
  catch (error) { res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;
