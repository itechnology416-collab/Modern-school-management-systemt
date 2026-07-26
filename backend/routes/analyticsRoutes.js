const express = require('express');
const router = express.Router();
const Fee = require('../models/Fee');
const Expense = require('../models/Expense');
const Salary = require('../models/Salary');
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Admission = require('../models/Admission');
const { protect } = require('../middleware/auth');

// @desc    Get superadmin dashboard analytics
// @route   GET /api/analytics/dashboard
router.get('/dashboard', protect, async (req, res) => {
  try {
    const today = new Date(); today.setHours(0,0,0,0);
    const yearStart = new Date(today.getFullYear(), 0, 1);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    const [fees, expenses, students, teachers, staffAttendance, admissions, totalExpenses] = await Promise.all([
      Fee.find({ schoolId: req.user.schoolId }),
      Expense.find({ schoolId: req.user.schoolId }),
      Student.countDocuments({ schoolId: req.user.schoolId }),
      Teacher.countDocuments({ schoolId: req.user.schoolId }),
      Attendance.find({ schoolId: req.user.schoolId, date: { $gte: today } }),
      Admission.find({ schoolId: req.user.schoolId }).sort({ createdAt: -1 }).limit(5),
      Expense.aggregate([{ $match: { schoolId: req.user.schoolId, date: { $gte: monthStart } } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
    ]);

    const totalFees = fees.reduce((s, f) => s + f.totalAmount, 0);
    const collectedFees = fees.reduce((s, f) => s + f.paidAmount, 0);
    const pendingFees = totalFees - collectedFees;
    const pendingCount = fees.filter(f => f.status !== 'paid').length;

    // Monthly income/expense
    const monthlyIncomeExpense = await Fee.aggregate([
      { $match: { schoolId: req.user.schoolId, createdAt: { $gte: yearStart } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, collected: { $sum: '$paidAmount' }, total: { $sum: '$totalAmount' } } },
      { $sort: { _id: 1 } },
    ]);

    const monthlyExpenses = await Expense.aggregate([
      { $match: { schoolId: req.user.schoolId, date: { $gte: yearStart } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$date' } }, total: { $sum: '$amount' } } },
      { $sort: { _id: 1 } },
    ]);

    // Staff attendance today
    const staffPresentToday = staffAttendance.filter(a => a.status === 'present').length;
    const staffAbsentToday = staffAttendance.filter(a => a.status === 'absent').length;

    // Recent admissions for widget
    const recentAdmissions = admissions.map(a => ({
      name: a.studentName, date: a.createdAt, status: a.status,
    }));

    res.json({
      stats: {
        unpaidInvoices: pendingCount,
        unpaidAmount: pendingFees,
        totalFees,
        collectedFees,
        totalStudents: students,
        totalTeachers: teachers,
        expenseThisMonth: totalExpenses[0]?.total || 0,
      },
      monthlyIncomeExpense,
      monthlyExpenses,
      staffAttendance: { present: staffPresentToday, absent: staffAbsentToday },
      recentAdmissions,
    });
  } catch (error) {
    console.error('Dashboard Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
