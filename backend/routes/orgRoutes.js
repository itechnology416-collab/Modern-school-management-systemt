const express = require('express');
const router = express.Router();
const Test = require('../models/Test');
const Approval = require('../models/Approval');
const Substitution = require('../models/Substitution');
const Conference = require('../models/Conference');
const Fee = require('../models/Fee');
const Student = require('../models/Student');
const { protect } = require('../middleware/auth');

// Tests CRUD
router.get('/tests', protect, async (req, res) => { try { res.json(await Test.find({ schoolId: req.user.schoolId }).populate('subjectId classId').sort({ date: -1 })); } catch { res.status(500).json(); } });
router.post('/tests', protect, async (req, res) => { try { res.status(201).json(await Test.create({ ...req.body, createdBy: req.user._id, schoolId: req.user.schoolId })); } catch { res.status(500).json(); } });
router.post('/tests/:id/results', protect, async (req, res) => {
  try { const t = await Test.findById(req.params.id); if (!t) return res.status(404).json(); t.results = req.body.results; t.isPublished = true; await t.save(); res.json(t); } catch { res.status(500).json(); }
});
router.put('/tests/:id', protect, async (req, res) => { try { res.json(await Test.findByIdAndUpdate(req.params.id, req.body, { new: true })); } catch { res.status(500).json(); } });
router.delete('/tests/:id', protect, async (req, res) => { try { await Test.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); } catch { res.status(500).json(); } });

// Approvals
router.get('/approvals', protect, async (req, res) => {
  try { const q = { schoolId: req.user.schoolId }; if (req.query.status) q.status = req.query.status; res.json(await Approval.find(q).populate('submittedBy', 'name email').sort({ createdAt: -1 })); }
  catch { res.status(500).json(); }
});
router.post('/approvals', protect, async (req, res) => { try { res.status(201).json(await Approval.create({ ...req.body, submittedBy: req.user._id, schoolId: req.user.schoolId })); } catch { res.status(500).json(); } });
router.put('/approvals/:id', protect, async (req, res) => {
  try {
    const approval = await Approval.findById(req.params.id);
    if (!approval) return res.status(404).json();
    const { action, comment } = req.body;
    const current = approval.approvers[approval.currentLevel];
    if (current) { current.status = action; current.comment = comment; current.respondedAt = new Date(); }
    if (action === 'approved') {
      if (approval.currentLevel + 1 >= approval.approvers.length) { approval.status = 'approved'; approval.resolvedAt = new Date(); }
      else approval.currentLevel += 1;
    } else { approval.status = 'rejected'; approval.resolvedAt = new Date(); }
    await approval.save(); res.json(approval);
  } catch { res.status(500).json(); }
});

// Substitutions
router.get('/substitutions', protect, async (req, res) => { try { res.json(await Substitution.find({ schoolId: req.user.schoolId }).populate('absentTeacherId substituteTeacherId classId subjectId', 'name').sort({ date: -1 })); } catch { res.status(500).json(); } });
router.post('/substitutions', protect, async (req, res) => { try { res.status(201).json(await Substitution.create({ ...req.body, schoolId: req.user.schoolId })); } catch { res.status(500).json(); } });

// Accounts Settlement
router.get('/settlement', protect, async (req, res) => {
  try {
    const { month, year } = req.query;
    const m = parseInt(month) || new Date().getMonth() + 1;
    const y = parseInt(year) || new Date().getFullYear();
    const start = new Date(y, m - 1, 1);
    const end = new Date(y, m, 0, 23, 59, 59);

    const [expected, collected] = await Promise.all([
      Fee.aggregate([{ $match: { schoolId: req.user.schoolId, dueDate: { $lte: end } } }, { $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
      Fee.aggregate([{ $match: { schoolId: req.user.schoolId, 'paymentHistory.paymentDate': { $gte: start, $lte: end } } }, { $unwind: '$paymentHistory' }, { $match: { 'paymentHistory.paymentDate': { $gte: start, $lte: end } } }, { $group: { _id: null, total: { $sum: '$paymentHistory.amount' } } }]),
    ]);
    const expectedTotal = expected[0]?.total || 0;
    const collectedTotal = collected[0]?.total || 0;
    res.json({ expected: expectedTotal, collected: collectedTotal, outstanding: expectedTotal - collectedTotal, percentage: expectedTotal > 0 ? ((collectedTotal / expectedTotal) * 100).toFixed(1) : '0' });
  } catch { res.status(500).json(); }
});

// Auto-generate roll number
router.post('/auto-roll/:classId', protect, async (req, res) => {
  try {
    const students = await Student.find({ classId: req.params.classId, schoolId: req.user.schoolId }).sort({ admissionDate: 1 });
    const startFrom = req.body.startFrom || 1;
    for (let i = 0; i < students.length; i++) { students[i].rollNo = startFrom + i; await students[i].save(); }
    res.json({ message: `${students.length} roll numbers assigned`, startFrom, endAt: startFrom + students.length - 1 });
  } catch { res.status(500).json(); }
});

// Timetable conflict detection
router.get('/conflicts', protect, async (req, res) => {
  try {
    const Timetable = require('../models/Timetable');
    const entries = await Timetable.find({ schoolId: req.user.schoolId }).populate('teacherId classId', 'name');
    const conflicts = [];
    const seen = {};
    for (const e of entries) {
      const key = `${e.teacherId?._id}-${e.day}-${e.startTime}`;
      if (seen[key]) conflicts.push({ teacher: e.teacherId?.name, day: e.day, time: e.startTime, class1: seen[key].className, class2: e.classId?.name });
      else seen[key] = { className: e.classId?.name };
    }
    res.json(conflicts);
  } catch { res.status(500).json(); }
});

module.exports = router;
