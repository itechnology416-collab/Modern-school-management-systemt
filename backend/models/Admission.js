const mongoose = require('mongoose');

const admissionSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  parentName: String,
  email: String,
  phone: String,
  classApplying: String,
  dateOfBirth: Date,
  gender: String,
  address: String,
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'inquiry'], default: 'pending' },
  previousSchool: String,
  documents: [String],
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
  processedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Admission', admissionSchema);
