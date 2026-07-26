const mongoose = require('mongoose');

const certificateTemplateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['achievement', 'participation', 'transfer', 'character', 'custom'], required: true },
  backgroundImage: String,
  content: { type: String, required: true },
  fontFamily: { type: String, default: 'Helvetica' },
  fontSize: { type: Number, default: 16 },
  primaryColor: { type: String, default: '#1a2744' },
  orientation: { type: String, enum: ['portrait', 'landscape'], default: 'landscape' },
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('CertificateTemplate', certificateTemplateSchema);
