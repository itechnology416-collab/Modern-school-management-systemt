const mongoose = require('mongoose');

const alumniSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: String,
  phone: String,
  graduationYear: { type: Number, required: true },
  degree: String,
  occupation: String,
  company: String,
  address: String,
  isVerified: { type: Boolean, default: false },
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
}, { timestamps: true });

alumniSchema.index({ schoolId: 1, graduationYear: -1 });

module.exports = mongoose.model('Alumni', alumniSchema);
