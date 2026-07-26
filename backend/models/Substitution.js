const mongoose = require('mongoose');

const substitutionSchema = new mongoose.Schema({
  absentTeacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  substituteTeacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
  date: { type: Date, required: true },
  period: String,
  reason: String,
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
}, { timestamps: true });

substitutionSchema.index({ date: 1, classId: 1 });

module.exports = mongoose.model('Substitution', substitutionSchema);
