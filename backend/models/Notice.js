const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  audience: { type: String, enum: ['all', 'parents', 'students', 'staff', 'specific_class'], default: 'all' },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  priority: { type: String, enum: ['low', 'normal', 'high', 'urgent'], default: 'normal' },
  expiryDate: Date,
  attachments: [{ fileName: String, fileUrl: String }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
  isPublished: { type: Boolean, default: true },
  viewCount: { type: Number, default: 0 },
}, { timestamps: true });

noticeSchema.index({ schoolId: 1, createdAt: -1 });
noticeSchema.index({ audience: 1 });

module.exports = mongoose.model('Notice', noticeSchema);
