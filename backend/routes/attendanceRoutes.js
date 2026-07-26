const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const Barcode = require('../models/Barcode');
const BiometricDevice = require('../models/BiometricDevice');
const Student = require('../models/Student');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');
const { markAttendance, bulkMarkAttendance, getAttendanceByDate, getMonthlyAttendance, getMyAttendance } = require('../controllers/attendanceController');

// ============ BASIC ATTENDANCE ============
router.get('/', protect, getAttendanceByDate);
router.get('/monthly', protect, getMonthlyAttendance);
router.get('/my', protect, authorize('student'), getMyAttendance);
router.post('/', protect, authorize('admin', 'teacher'), markAttendance);
router.post('/bulk', protect, authorize('admin', 'teacher'), bulkMarkAttendance);

// ============ ADVANCED ATTENDANCE REPORT ============
router.get('/report', protect, async (req, res) => {
  try {
    const { classId, month, year, studentId, method } = req.query;
    const m = parseInt(month) || new Date().getMonth() + 1;
    const y = parseInt(year) || new Date().getFullYear();
    const startDate = new Date(y, m - 1, 1);
    const endDate = new Date(y, m, 0, 23, 59, 59);

    const query = { schoolId: req.user.schoolId, date: { $gte: startDate, $lte: endDate } };
    if (classId) query.classId = classId;
    if (studentId) query.studentId = studentId;
    if (method) query.method = method;

    const [records, methodBreakdown, dailyTrend, summary] = await Promise.all([
      Attendance.find(query).populate({ path: 'studentId', populate: { path: 'userId', select: 'name' } }).populate('classId', 'name section').sort({ date: 1 }),
      Attendance.aggregate([{ $match: query }, { $group: { _id: '$method', count: { $sum: 1 } } }]),
      Attendance.aggregate([{ $match: query }, { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } }, present: { $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] } }, absent: { $sum: { $cond: [{ $eq: ['$status', 'absent'] }, 1, 0] } }, late: { $sum: { $cond: [{ $eq: ['$status', 'late'] }, 1, 0] } }, total: { $sum: 1 } } }, { $sort: { _id: 1 } }]),
      Attendance.aggregate([{ $match: query }, { $group: { _id: '$status', count: { $sum: 1 } } }]),
    ]);

    const total = records.length;
    const present = summary.find(s => s._id === 'present')?.count || 0;
    const absent = summary.find(s => s._id === 'absent')?.count || 0;
    const late = summary.find(s => s._id === 'late')?.count || 0;

    res.json({
      period: { month: m, year: y },
      summary: { total, present, absent, late, percentage: total > 0 ? ((present / total) * 100).toFixed(1) : 0 },
      methodBreakdown, dailyTrend, records
    });
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
});

// ============ VOICE ATTENDANCE ============
router.post('/voice', protect, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const { transcript, classId, date } = req.body;
    const attendanceDate = date || new Date().toISOString().split('T')[0];
    const results = [], errors = [];
    const phrases = transcript.split(/[,;\n]+/).filter(p => p.trim());
    const students = await Student.find({ classId }).populate('userId', 'name');

    for (const phrase of phrases) {
      const trimmed = phrase.trim().toLowerCase();
      let status = 'present';
      if (/\babsent\b/.test(trimmed)) status = 'absent';
      else if (/\blate\b/.test(trimmed)) status = 'late';
      else if (/\bhalf.?day\b/.test(trimmed)) status = 'half-day';

      const namePart = trimmed.replace(/\b(present|absent|late|half.?day)\b/gi, '').trim();
      const matched = students.find(s => s.userId?.name?.toLowerCase().includes(namePart) || namePart.includes(s.userId?.name?.toLowerCase().split(' ')[0]));

      if (!matched) { errors.push({ phrase: trimmed, error: 'Student not found' }); continue; }

      await Attendance.findOneAndUpdate(
        { studentId: matched._id, date: new Date(attendanceDate) },
        { studentId: matched._id, classId, date: new Date(attendanceDate), status, markedBy: req.user._id, schoolId: req.user.schoolId, method: 'voice', markedAt: new Date().toLocaleTimeString() },
        { upsert: true, new: true }
      );
      results.push({ student: matched.userId.name, status });
    }
    res.json({ success: results.length, failed: errors.length, results, errors });
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
});

// ============ BARCODE ATTENDANCE ============
router.post('/barcode', protect, async (req, res) => {
  try {
    const { barcodeValue, classId, date, status } = req.body;
    const barcode = await Barcode.findOne({ barcodeValue, isActive: true });
    if (!barcode) return res.status(404).json({ message: 'Invalid barcode' });

    const student = await Student.findById(barcode.studentId).populate('userId', 'name');
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const attendanceDate = date || new Date().toISOString().split('T')[0];
    const record = await Attendance.findOneAndUpdate(
      { studentId: student._id, date: new Date(attendanceDate) },
      { studentId: student._id, classId: classId || student.classId, date: new Date(attendanceDate), status: status || 'present', markedBy: req.user._id, schoolId: req.user.schoolId, method: 'barcode', markedAt: new Date().toLocaleTimeString() },
      { upsert: true, new: true }
    );
    res.json({ student: student.userId.name, rollNo: student.rollNo, status: status || 'present', scannedAt: new Date().toLocaleTimeString() });
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
});

router.post('/barcode/register', protect, authorize('admin'), async (req, res) => {
  try {
    const { studentId, barcodeValue } = req.body;
    const exists = await Barcode.findOne({ barcodeValue });
    if (exists) return res.status(400).json({ message: 'Barcode already registered' });
    const barcode = await Barcode.create({ studentId, barcodeValue, schoolId: req.user.schoolId });
    res.status(201).json(barcode);
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
});

router.get('/barcodes', protect, async (req, res) => {
  try {
    const barcodes = await Barcode.find({ schoolId: req.user.schoolId }).populate({ path: 'studentId', populate: { path: 'userId', select: 'name' } });
    res.json(barcodes);
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
});

// ============ BIOMETRIC DEVICES ============
router.get('/biometric/devices', protect, async (req, res) => {
  try { res.json(await BiometricDevice.find({ schoolId: req.user.schoolId })); }
  catch (error) { res.status(500).json({ message: 'Server error' }); }
});

router.post('/biometric/devices', protect, authorize('admin'), async (req, res) => {
  try { res.status(201).json(await BiometricDevice.create({ ...req.body, schoolId: req.user.schoolId })); }
  catch (error) { res.status(500).json({ message: 'Server error' }); }
});

router.put('/biometric/devices/:id', protect, authorize('admin'), async (req, res) => {
  try { res.json(await BiometricDevice.findByIdAndUpdate(req.params.id, req.body, { new: true })); }
  catch (error) { res.status(500).json({ message: 'Server error' }); }
});

router.post('/biometric/sync', protect, authorize('admin'), async (req, res) => {
  try {
    const { deviceId, records } = req.body;
    const device = await BiometricDevice.findOne({ deviceId, schoolId: req.user.schoolId });
    if (!device) return res.status(404).json({ message: 'Device not found' });

    let synced = 0;
    for (const r of records) {
      const student = await Student.findOne({ rollNo: r.rollNo, schoolId: req.user.schoolId });
      if (!student) continue;
      await Attendance.findOneAndUpdate(
        { studentId: student._id, date: new Date(r.date) },
        { studentId: student._id, classId: student.classId, date: new Date(r.date), status: r.status || 'present', markedBy: req.user._id, schoolId: req.user.schoolId, method: 'biometric', markedAt: r.time },
        { upsert: true, new: true }
      );
      synced++;
    }
    device.lastSync = new Date(); device.recordsPulled += synced; device.status = 'online';
    await device.save();
    res.json({ synced, device });
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;
