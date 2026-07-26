const express = require('express');
const router = express.Router();
const Fee = require('../models/Fee');
const Student = require('../models/Student');
const Parent = require('../models/Parent');
const Wallet = require('../models/Wallet');
const Expense = require('../models/Expense');
const { protect } = require('../middleware/auth');

// ─── Fee Increment (by % or fixed amount) ───
router.post('/increment', protect, async (req, res) => {
  try {
    const { classId, percent, amount, feeName, academicYear } = req.body;
    const query = { schoolId: req.user.schoolId };
    if (classId) query.classId = classId;
    if (feeName) query.feeName = feeName;
    if (academicYear) query.academicYear = academicYear;

    const fees = await Fee.find(query);
    const updates = [];
    for (const f of fees) {
      const increment = amount || Math.round(f.totalAmount * (percent / 100));
      f.totalAmount += increment;
      f.previousAmount = f.totalAmount - increment;
      await f.save();
      updates.push({ id: f._id, previous: f.totalAmount - increment, updated: f.totalAmount });
    }
    res.json({ message: `${updates.length} fees incremented`, count: updates.length, updates });
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

// ─── Fee Decrement (by % or fixed amount) ───
router.post('/decrement', protect, async (req, res) => {
  try {
    const { classId, percent, amount, feeName, academicYear } = req.body;
    const query = { schoolId: req.user.schoolId };
    if (classId) query.classId = classId;
    if (feeName) query.feeName = feeName;
    if (academicYear) query.academicYear = academicYear;

    const fees = await Fee.find(query);
    const updates = [];
    for (const f of fees) {
      const decrement = amount || Math.round(f.totalAmount * (percent / 100));
      f.totalAmount = Math.max(0, f.totalAmount - decrement);
      f.previousAmount = f.totalAmount + decrement;
      await f.save();
      updates.push({ id: f._id, previous: f.totalAmount + decrement, updated: f.totalAmount });
    }
    res.json({ message: `${updates.length} fees decremented`, count: updates.length, updates });
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

// ─── Family Fee Calculator ───
router.get('/family-calculator/:parentId', protect, async (req, res) => {
  try {
    const parent = await Parent.findOne({ userId: req.params.parentId });
    if (!parent) return res.status(404).json({ message: 'Parent not found' });

    const childrenFees = await Fee.find({ studentId: { $in: parent.children }, schoolId: req.user.schoolId }).populate({ path: 'studentId', populate: { path: 'userId', select: 'name' } });
    const total = childrenFees.reduce((s, f) => s + f.totalAmount, 0);
    const paid = childrenFees.reduce((s, f) => s + f.paidAmount, 0);
    const pending = total - paid;

    // Group by student
    const byStudent = {};
    childrenFees.forEach(f => { const sid = f.studentId?._id.toString(); if (!byStudent[sid]) byStudent[sid] = { student: f.studentId?.userId?.name, total: 0, paid: 0, fees: [] }; byStudent[sid].total += f.totalAmount; byStudent[sid].paid += f.paidAmount; byStudent[sid].fees.push(f); });

    res.json({ parentName: parent.userId?.name || 'Parent', studentCount: parent.children.length, totalFees: total, paidFees: paid, pendingFees: pending, byStudent: Object.values(byStudent) });
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

// ─── Discount Student ───
router.post('/discount/:studentId', protect, async (req, res) => {
  try {
    const { percent, amount, reason } = req.body;
    const fees = await Fee.find({ studentId: req.params.studentId, schoolId: req.user.schoolId });
    if (!fees.length) return res.status(404).json({ message: 'No fees found for this student' });

    const results = [];
    for (const f of fees) {
      const discount = amount || Math.round(f.totalAmount * (percent / 100));
      f.concessionAmount = (f.concessionAmount || 0) + discount;
      f.totalAmount = Math.max(0, f.totalAmount - discount);
      f.discountReason = reason;
      await f.save();
      results.push({ feeName: f.feeName, discount, newTotal: f.totalAmount });
    }
    res.json({ studentId: req.params.studentId, discountsApplied: results.length, results });
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

// ─── Balance Sheet ───
router.get('/balance-sheet', protect, async (req, res) => {
  try {
    const { month, year } = req.query;
    const m = parseInt(month) || new Date().getMonth() + 1;
    const y = parseInt(year) || new Date().getFullYear();
    const start = new Date(y, m - 1, 1);
    const end = new Date(y, m, 0, 23, 59, 59);

    const [incomeFees, expenses, salaries, sales] = await Promise.all([
      Fee.aggregate([{ $match: { schoolId: req.user.schoolId, 'paymentHistory.paymentDate': { $gte: start, $lte: end } } }, { $unwind: '$paymentHistory' }, { $match: { 'paymentHistory.paymentDate': { $gte: start, $lte: end } } }, { $group: { _id: null, total: { $sum: '$paymentHistory.amount' } } }]),
      Expense.aggregate([{ $match: { schoolId: req.user.schoolId, date: { $gte: start, $lte: end } } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
      require('../models/Salary').aggregate([{ $match: { schoolId: req.user.schoolId, month: new Date(y, m - 1).toLocaleString('default', { month: 'long' }), year: y } }, { $group: { _id: null, total: { $sum: '$netPay' } } }]),
      require('../models/Sale').aggregate([{ $match: { schoolId: req.user.schoolId, createdAt: { $gte: start, $lte: end } } }, { $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
    ]);

    const totalIncome = (incomeFees[0]?.total || 0) + (sales[0]?.total || 0);
    const totalExpenses = (expenses[0]?.total || 0) + (salaries[0]?.total || 0);
    res.json({
      period: { month: m, year: y },
      income: { fees: incomeFees[0]?.total || 0, sales: sales[0]?.total || 0, total: totalIncome },
      expenses: { operational: expenses[0]?.total || 0, salaries: salaries[0]?.total || 0, total: totalExpenses },
      netProfit: totalIncome - totalExpenses,
    });
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

// ─── Deleted Fees Recovery ───
router.get('/deleted', protect, async (req, res) => {
  try {
    const fees = await Fee.find({ schoolId: req.user.schoolId, isDeleted: true }).populate({ path: 'studentId', populate: { path: 'userId', select: 'name' } });
    res.json(fees);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

router.post('/restore/:id', protect, async (req, res) => {
  try { res.json(await Fee.findByIdAndUpdate(req.params.id, { isDeleted: false, deletedAt: null, deletedBy: null }, { new: true })); }
  catch (err) { res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;
