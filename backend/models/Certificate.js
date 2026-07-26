const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  templateId: { type: mongoose.Schema.Types.ObjectId, ref: 'CertificateTemplate' },
  type: { type: String, enum: ['achievement', 'participation', 'transfer', 'character', 'custom'], required: true },
  title: { type: String, required: true },
  issuedDate: { type: Date, default: Date.now },
  content: String,
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
  issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Certificate', certificateSchema);
