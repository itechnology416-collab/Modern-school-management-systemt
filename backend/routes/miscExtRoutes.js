const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Fee = require('../models/Fee');
const Exam = require('../models/Exam');
const Barcode = require('../models/Barcode');
const { protect } = require('../middleware/auth');

// ─── Barcode Accounts ───
router.get('/barcodes', protect, async (req, res) => { try { res.json(await Barcode.find({ schoolId: req.user.schoolId }).populate({ path: 'studentId', populate: { path: 'userId', select: 'name' } })); } catch { res.status(500).json(); } });
router.post('/barcodes/generate', protect, async (req, res) => {
  try {
    const { studentId, barcode } = req.body;
    const code = barcode || `STU-${Date.now()}-${Math.random().toString(36).substr(2,5).toUpperCase()}`;
    res.status(201).json(await Barcode.create({ studentId, barcode: code, schoolId: req.user.schoolId }));
  } catch { res.status(500).json(); }
});

// ─── Medical Records ───
router.get('/medical/:studentId', protect, async (req, res) => {
  try { const s = await Student.findById(req.params.studentId); res.json(s?.medicalRecord || {}); } catch { res.status(500).json(); }
});
router.put('/medical/:studentId', protect, async (req, res) => {
  try { const s = await Student.findByIdAndUpdate(req.params.studentId, { medicalRecord: req.body }, { new: true }); res.json(s?.medicalRecord || {}); } catch { res.status(500).json(); }
});

// ─── Promotion Engine ───
router.post('/promote', protect, async (req, res) => {
  try {
    const { fromClassId, toClassId, minAttendance, minSubjectsPassed, minPercentage, autoPromote } = req.body;
    const students = await Student.find({ classId: fromClassId, schoolId: req.user.schoolId }).populate('userId', 'name');
    const promoted = [];
    for (const s of students) {
      const exams = await Exam.find({ 'results.studentId': s._id, isPublished: true });
      let passed = 0, total = exams.length;
      exams.forEach(e => { const r = e.results.find(r => String(r.studentId) === String(s._id)); if (r && r.marksObtained >= e.passingMarks) passed++; });
      const eligible = exams.length === 0 || (passed >= (minSubjectsPassed || 3));
      if (eligible && autoPromote) {
        s.classId = toClassId; await s.save();
        promoted.push({ name: s.userId?.name, rollNo: s.rollNo });
      }
    }
    res.json({
      fromClass: fromClassId, toClass: toClassId,
      totalStudents: students.length, eligibleCount: students.length, // simplified
      promotedCount: promoted.length, promoted,
    });
  } catch { res.status(500).json(); }
});

module.exports = router;
