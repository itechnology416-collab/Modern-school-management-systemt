const express = require('express');
const router = express.Router();
const Wallet = require('../models/Wallet');
const Notice = require('../models/Notice');
const Diary = require('../models/Diary');
const CertificateTemplate = require('../models/CertificateTemplate');
const { protect } = require('../middleware/auth');

// ─── Wallet ───
router.get('/wallets', protect, async (req, res) => { try { res.json(await Wallet.find({ schoolId: req.user.schoolId }).populate('parentId', 'name email').populate('studentIds'); } catch { res.status(500).json({ message: 'Server error' }); } });
router.post('/wallets', protect, async (req, res) => {
  try { const w = await Wallet.create({ ...req.body, schoolId: req.user.schoolId }); if (req.body.initialDeposit > 0) { w.transactions.push({ type: 'deposit', amount: req.body.initialDeposit, balanceAfter: req.body.initialDeposit, description: 'Initial deposit', processedBy: req.user._id }); w.balance = req.body.initialDeposit; await w.save(); } res.status(201).json(w); }
  catch { res.status(500).json({ message: 'Server error' }); }
});
router.post('/wallets/:id/deposit', protect, async (req, res) => {
  try { const w = await Wallet.findById(req.params.id); if (!w) return res.status(404).json(); w.balance += req.body.amount; w.transactions.push({ type: 'deposit', amount: req.body.amount, balanceAfter: w.balance, description: req.body.description, paymentMethod: req.body.paymentMethod, processedBy: req.user._id }); await w.save(); res.json(w); }
  catch { res.status(500).json({ message: 'Server error' }); }
});
router.post('/wallets/:id/pay-fee', protect, async (req, res) => {
  try { const w = await Wallet.findById(req.params.id); if (!w) return res.status(404).json(); if (w.balance < req.body.amount) return res.status(400).json({ message: 'Insufficient wallet balance' }); w.balance -= req.body.amount; w.transactions.push({ type: 'fee_payment', amount: req.body.amount, balanceAfter: w.balance, description: req.body.description, feeId: req.body.feeId, processedBy: req.user._id }); await w.save(); res.json(w); }
  catch { res.status(500).json({ message: 'Server error' }); }
});

// ─── Notice Board (Admin CRUD) ───
router.get('/notices', async (req, res) => { try { res.json(await Notice.find({ schoolId: req.query.schoolId, isPublished: true }).sort({ createdAt: -1 }).populate('createdBy', 'name')); } catch { res.status(500).json({ message: 'Server error' }); } });
router.post('/notices', protect, async (req, res) => { try { res.status(201).json(await Notice.create({ ...req.body, createdBy: req.user._id, schoolId: req.user.schoolId })); } catch { res.status(500).json({ message: 'Server error' }); } });
router.put('/notices/:id', protect, async (req, res) => { try { res.json(await Notice.findByIdAndUpdate(req.params.id, req.body, { new: true })); } catch { res.status(500).json({ message: 'Server error' }); } });
router.delete('/notices/:id', protect, async (req, res) => { try { await Notice.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); } catch { res.status(500).json({ message: 'Server error' }); } });

// ─── Daily Diary ───
router.get('/diary', protect, async (req, res) => {
  try { const { classId, date, teacherId } = req.query; const q = { schoolId: req.user.schoolId }; if (classId) q.classId = classId; if (date) q.date = new Date(date); if (teacherId) q.teacherId = teacherId; res.json(await Diary.find(q).populate('subjectId classId teacherId', 'name').sort({ date: -1 })); }
  catch { res.status(500).json({ message: 'Server error' }); }
});
router.post('/diary', protect, async (req, res) => { try { res.status(201).json(await Diary.create({ ...req.body, teacherId: req.user._id, schoolId: req.user.schoolId })); } catch { res.status(500).json({ message: 'Server error' }); } });

// ─── Certificate Templates ───
router.get('/certificate-templates', protect, async (req, res) => { try { res.json(await CertificateTemplate.find({ schoolId: req.user.schoolId })); } catch { res.status(500).json({ message: 'Server error' }); } });
router.post('/certificate-templates', protect, async (req, res) => { try { res.status(201).json(await CertificateTemplate.create({ ...req.body, schoolId: req.user.schoolId })); } catch { res.status(500).json({ message: 'Server error' }); } });
router.delete('/certificate-templates/:id', protect, async (req, res) => { try { await CertificateTemplate.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); } catch { res.status(500).json({ message: 'Server error' }); } });

module.exports = router;
