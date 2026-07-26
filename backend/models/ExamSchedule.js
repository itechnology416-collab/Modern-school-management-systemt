const mongoose = require('mongoose');

const examScheduleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  exams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exam' }],
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  term: { type: String, enum: ['term-1', 'term-2', 'term-3', 'annual'], required: true },
  academicYear: { type: String, required: true },
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
  isPublished: { type: Boolean, default: false },
}, { timestamps: true });

examScheduleSchema.index({ classId: 1, term: 1, academicYear: 1 }, { unique: true });

module.exports = mongoose.model('ExamSchedule', examScheduleSchema);
