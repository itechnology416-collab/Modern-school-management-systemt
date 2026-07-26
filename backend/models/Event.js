const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  eventType: { type: String, enum: ['academic', 'sports', 'cultural', 'holiday', 'exam', 'meeting', 'other'], default: 'other' },
  startDate: { type: Date, required: true },
  endDate: Date,
  allDay: { type: Boolean, default: false },
  audience: { type: String, enum: ['all', 'students', 'staff', 'parents'], default: 'all' },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
}, { timestamps: true });

eventSchema.index({ schoolId: 1, startDate: 1 });

module.exports = mongoose.model('Event', eventSchema);
