const mongoose = require('mongoose');

const campusSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: String,
  phone: String,
  email: String,
  principalName: String,
  isActive: { type: Boolean, default: true },
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Campus', campusSchema);
