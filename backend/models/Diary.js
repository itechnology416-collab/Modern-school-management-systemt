const mongoose = require('mongoose');

const diarySchema = new mongoose.Schema({
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  topic: { type: String, required: true },
  description: String,
  attachments: [{ fileName: String, fileUrl: String }],
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
}, { timestamps: true });

diarySchema.index({ classId: 1, date: -1 });
diarySchema.index({ teacherId: 1, date: -1 });

module.exports = mongoose.model('Diary', diarySchema);
