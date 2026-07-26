const express = require('express');
const router = express.Router();
const Exam = require('../models/Exam');
const { protect } = require('../middleware/auth');

// Basic CRUD
router.get('/', protect, async (req, res) => { try { res.json(await Exam.find({ schoolId: req.user.schoolId }).populate('subjectId classId')); } catch { res.status(500).json({ message: 'Server error' }); } });

router.post('/', protect, async (req, res) => {
  try { res.status(201).json(await Exam.create({ ...req.body, schoolId: req.user.schoolId })); } catch { res.status(500).json({ message: 'Server error' }); }
});

router.put('/:id', protect, async (req, res) => {
  try { res.json(await Exam.findByIdAndUpdate(req.params.id, req.body, { new: true })); } catch { res.status(500).json({ message: 'Server error' }); }
});

router.delete('/:id', protect, async (req, res) => {
  try { await Exam.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); } catch { res.status(500).json({ message: 'Server error' }); }
});

// Publish results
router.post('/:id/results', protect, async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });
    exam.results = req.body.results;
    exam.isPublished = true;
    await exam.save();
    res.json(exam);
  } catch { res.status(500).json({ message: 'Server error' }); }
});

// Tabulation - get sorted results with rank
router.get('/:id/tabulation', protect, async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id).populate('subjectId classId');
    if (!exam) return res.status(404).json({ message: 'Exam not found' });
    const sorted = (exam.results || []).sort((a, b) => (b.marksObtained || 0) - (a.marksObtained || 0));
    const ranked = sorted.map((r, i) => ({ ...r.toObject(), rank: i + 1, totalStudents: sorted.length }));
    res.json({ exam: { name: exam.name, subjectId: exam.subjectId, classId: exam.classId, maxMarks: exam.maxMarks, passingMarks: exam.passingMarks, date: exam.date }, results: ranked });
  } catch { res.status(500).json({ message: 'Server error' }); }
});

// Position holder
router.get('/:id/position-holders', protect, async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });
    const sorted = (exam.results || []).sort((a, b) => (b.marksObtained || 0) - (a.marksObtained || 0));
    res.json(sorted.slice(0, 3));
  } catch { res.status(500).json({ message: 'Server error' }); }
});

// Grade boundaries - get/update
router.get('/:id/grades', protect, async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    // Return results with grades based on boundaries
    const boundaries = req.query.boundaries ? JSON.parse(req.query.boundaries) : { 'A+': 90, 'A': 80, 'B': 70, 'C': 60, 'D': 50, 'E': 40 };
    if (!exam?.results) return res.json([]);
    const graded = exam.results.map(r => {
      const pct = (r.marksObtained / exam.maxMarks) * 100;
      let grade = 'F';
      for (const [g, threshold] of Object.entries(boundaries).sort((a, b) => b[1] - a[1])) { if (pct >= threshold) { grade = g; break; } }
      return { ...r.toObject(), grade, percentage: pct.toFixed(1) };
    });
    res.json(graded);
  } catch { res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;
