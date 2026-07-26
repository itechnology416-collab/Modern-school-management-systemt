const express = require('express');
const router = express.Router();
const Hostel = require('../models/Hostel');
const Event = require('../models/Event');
const Alumni = require('../models/Alumni');
const Conference = require('../models/Conference');
const Gallery = require('../models/Gallery');
const { protect } = require('../middleware/auth');

// Hostel
router.get('/hostels', protect, async (req, res) => { try { res.json(await Hostel.find({ schoolId: req.user.schoolId })); } catch { res.status(500).json(); } });
router.post('/hostels', protect, async (req, res) => { try { res.status(201).json(await Hostel.create({ ...req.body, schoolId: req.user.schoolId })); } catch { res.status(500).json(); } });
router.put('/hostels/:id', protect, async (req, res) => { try { res.json(await Hostel.findByIdAndUpdate(req.params.id, req.body, { new: true })); } catch { res.status(500).json(); } });
router.delete('/hostels/:id', protect, async (req, res) => { try { await Hostel.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); } catch { res.status(500).json(); } });

// Events
router.get('/events', protect, async (req, res) => { try { res.json(await Event.find({ schoolId: req.user.schoolId }).sort({ startDate: 1 }).populate('classId', 'name section')); } catch { res.status(500).json(); } });
router.post('/events', protect, async (req, res) => { try { res.status(201).json(await Event.create({ ...req.body, schoolId: req.user.schoolId })); } catch { res.status(500).json(); } });
router.delete('/events/:id', protect, async (req, res) => { try { await Event.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); } catch { res.status(500).json(); } });

// Alumni
router.get('/alumni', protect, async (req, res) => { try { res.json(await Alumni.find({ schoolId: req.user.schoolId }).sort({ graduationYear: -1 })); } catch { res.status(500).json(); } });
router.post('/alumni', protect, async (req, res) => { try { res.status(201).json(await Alumni.create({ ...req.body, schoolId: req.user.schoolId })); } catch { res.status(500).json(); } });
router.put('/alumni/:id', protect, async (req, res) => { try { res.json(await Alumni.findByIdAndUpdate(req.params.id, req.body, { new: true })); } catch { res.status(500).json(); } });

// Conferences
router.get('/conferences', protect, async (req, res) => { try { res.json(await Conference.find({ schoolId: req.user.schoolId }).populate('teacherId parentId studentId', 'name').sort({ date: 1 })); } catch { res.status(500).json(); } });
router.post('/conferences', protect, async (req, res) => { try { res.status(201).json(await Conference.create({ ...req.body, schoolId: req.user.schoolId })); } catch { res.status(500).json(); } });
router.put('/conferences/:id', protect, async (req, res) => { try { res.json(await Conference.findByIdAndUpdate(req.params.id, req.body, { new: true })); } catch { res.status(500).json(); } });

// Gallery
router.get('/gallery', protect, async (req, res) => { try { res.json(await Gallery.find({ schoolId: req.user.schoolId, isPublished: true }).sort({ createdAt: -1 })); } catch { res.status(500).json(); } });
router.post('/gallery', protect, async (req, res) => { try { res.status(201).json(await Gallery.create({ ...req.body, uploadedBy: req.user._id, schoolId: req.user.schoolId })); } catch { res.status(500).json(); } });
router.delete('/gallery/:id', protect, async (req, res) => { try { await Gallery.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); } catch { res.status(500).json(); } });

module.exports = router;
