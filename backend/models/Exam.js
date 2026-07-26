const mongoose = require('mongoose');

const examSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Exam name is required'],
      trim: true,
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
    },
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
    },
    examType: {
      type: String,
      enum: ['test', 'mid-term', 'final', 'quiz', 'practical', 'oral'],
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
    },
    endTime: {
      type: String,
    },
    duration: {
      type: Number, // minutes
    },
    maxMarks: {
      type: Number,
      required: true,
    },
    passingMarks: {
      type: Number,
      required: true,
    },
    syllabus: {
      type: String,
    },
    results: [
      {
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
        marksObtained: Number,
        grade: String,
        remarks: String,
        published: { type: Boolean, default: false },
      },
    ],
    isPublished: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

examSchema.index({ classId: 1, subjectId: 1 });
examSchema.index({ schoolId: 1, isPublished: 1 });
examSchema.index({ date: 1 });
module.exports = mongoose.model('Exam', examSchema);
