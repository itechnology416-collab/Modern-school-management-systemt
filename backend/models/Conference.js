const mongoose = require('mongoose');

const conferenceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  date: { type: Date, required: true },
  time: String,
  duration: { type: Number, default: 30 },
  status: { type: String, enum: ['scheduled', 'completed', 'cancelled'], default: 'scheduled' },
  notes: String,
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
}, { timestamps: true });

conferenceSchema.index({ teacherId: 1, date: 1 });
conferenceSchema.index({ parentId: 1, date: 1 });

module.exports = mongoose.model('Conference', conferenceSchema);
