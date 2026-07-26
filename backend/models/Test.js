const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  name: { type: String, required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  date: { type: Date, required: true },
  maxMarks: { type: Number, required: true },
  passingMarks: { type: Number, required: true },
  duration: Number,
  results: [{ studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' }, marksObtained: Number, grade: String, remarks: String }],
  isPublished: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
}, { timestamps: true });

testSchema.index({ classId: 1, subjectId: 1 });

module.exports = mongoose.model('Test', testSchema);
