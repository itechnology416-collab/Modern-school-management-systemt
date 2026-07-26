const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  capacity: { type: Number, default: 40 },
  roomNumber: String,
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

sectionSchema.index({ name: 1, classId: 1 }, { unique: true });
module.exports = mongoose.model('Section', sectionSchema);
