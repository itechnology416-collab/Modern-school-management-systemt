const express = require('express');
const router = express.Router();
const Exam = require('../models/Exam');
const ExamSchedule = require('../models/ExamSchedule');
const { protect } = require('../middleware/auth');

// ─── Position Holder (Term-wise) ───
router.get('/position-holder/term', protect, async (req, res) => {
  try {
    const { classId, term, academicYear } = req.query;
    const schedule = await ExamSchedule.findOne({ classId, term, academicYear, schoolId: req.user.schoolId });
    if (!schedule) return res.json({ message: 'No schedule found', holders: [] });

    const exams = await Exam.find({ _id: { $in: schedule.exams }, isPublished: true });
    if (!exams.length) return res.json({ message: 'No published exams', holders: [] });

    // Aggregate all marks per student across exams
    const studentTotals = {};
    exams.forEach(exam => {
      (exam.results || []).forEach(r => {
        const sid = String(r.studentId || '');
        if (!studentTotals[sid]) studentTotals[sid] = { studentId: sid, obtained: 0, total: 0 };
        studentTotals[sid].obtained += r.marksObtained || 0;
        studentTotals[sid].total += exam.maxMarks || 0;
      });
    });

    const ranked = Object.values(studentTotals)
      .map(s => ({ ...s, percentage: s.total > 0 ? ((s.obtained / s.total) * 100).toFixed(1) : '0' }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 3);

    res.json({ term, academicYear, classId, holders: ranked });
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

// ─── Position Holder (Final / Annual) ───
router.get('/position-holder/final', protect, async (req, res) => {
  try {
    const { classId, academicYear } = req.query;
    const schedules = await ExamSchedule.find({ classId, academicYear, schoolId: req.user.schoolId });
    const examIds = schedules.flatMap(s => s.exams);
    const exams = await Exam.find({ _id: { $in: examIds }, isPublished: true });

    const studentTotals = {};
    exams.forEach(exam => {
      (exam.results || []).forEach(r => {
        const sid = String(r.studentId || '');
        if (!studentTotals[sid]) studentTotals[sid] = { studentId: sid, obtained: 0, total: 0 };
        studentTotals[sid].obtained += r.marksObtained || 0;
        studentTotals[sid].total += exam.maxMarks || 0;
      });
    });

    const ranked = Object.values(studentTotals)
      .map(s => ({ ...s, percentage: s.total > 0 ? ((s.obtained / s.total) * 100).toFixed(1) : '0' }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 5);

    res.json({ academicYear, classId, holders: ranked });
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

// ─── Send Marks by SMS (generate SMS text per student) ───
router.get('/marks-sms/:examId', protect, async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.examId).populate('subjectId');
    if (!exam?.results?.length) return res.json([]);

    const messages = exam.results.map(r => ({
      studentId: r.studentId,
      message: `${exam.name} - ${exam.subjectId?.name}: Obtained ${r.marksObtained}/${exam.maxMarks}. Grade: ${r.grade}.`,
    }));
    res.json({ exam: exam.name, messages });
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

// ─── Exam Schedule CRUD ───
router.post('/schedules', protect, async (req, res) => { try { res.status(201).json(await ExamSchedule.create({ ...req.body, schoolId: req.user.schoolId })); } catch { res.status(500).json({ message: 'Server error' }); } });
router.get('/schedules', protect, async (req, res) => { try { res.json(await ExamSchedule.find({ schoolId: req.user.schoolId }).populate('exams classId')); } catch { res.status(500).json({ message: 'Server error' }); } });

module.exports = router;
