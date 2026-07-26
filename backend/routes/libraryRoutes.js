const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const BookIssue = require('../models/BookIssue');
const { protect } = require('../middleware/auth');

// Books CRUD
router.get('/books', protect, async (req, res) => { try { res.json(await Book.find({ schoolId: req.user.schoolId }).sort({ title: 1 })); } catch { res.status(500).json({ message: 'Server error' }); } });
router.post('/books', protect, async (req, res) => { try { const b = await Book.create({ ...req.body, schoolId: req.user.schoolId, available: req.body.quantity || 1 }); res.status(201).json(b); } catch { res.status(500).json(); } });
router.put('/books/:id', protect, async (req, res) => { try { res.json(await Book.findByIdAndUpdate(req.params.id, req.body, { new: true })); } catch { res.status(500).json(); } });
router.delete('/books/:id', protect, async (req, res) => { try { await Book.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); } catch { res.status(500).json(); } });

// Issues
router.get('/issues', protect, async (req, res) => { try { res.json(await BookIssue.find({ schoolId: req.user.schoolId }).populate('bookId userId', 'title name email').sort({ issueDate: -1 })); } catch { res.status(500).json(); } });
router.post('/issues', protect, async (req, res) => {
  try {
    const book = await Book.findById(req.body.bookId);
    if (!book || book.available < 1) return res.status(400).json({ message: 'Book not available' });
    book.available -= 1; await book.save();
    const issue = await BookIssue.create({ ...req.body, schoolId: req.user.schoolId });
    res.status(201).json(issue);
  } catch { res.status(500).json(); }
});
router.post('/issues/:id/return', protect, async (req, res) => {
  try {
    const issue = await BookIssue.findById(req.params.id);
    if (!issue || issue.status === 'returned') return res.status(400).json({ message: 'Already returned' });
    issue.returnDate = new Date(); issue.status = 'returned';
    const daysLate = Math.max(0, Math.ceil((issue.returnDate - issue.dueDate) / (1000 * 60 * 60 * 24)));
    issue.fine = daysLate * (issue.finePerDay || 2);
    await issue.save();
    await Book.findByIdAndUpdate(issue.bookId, { $inc: { available: 1 } });
    res.json(issue);
  } catch { res.status(500).json(); }
});

module.exports = router;
