const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  issueDate: { type: Date, default: Date.now },
  dueDate: { type: Date, required: true },
  returnDate: Date,
  fine: { type: Number, default: 0 },
  finePerDay: { type: Number, default: 2 },
  status: { type: String, enum: ['issued', 'returned', 'overdue'], default: 'issued' },
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
}, { timestamps: true });

issueSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model('BookIssue', issueSchema);
