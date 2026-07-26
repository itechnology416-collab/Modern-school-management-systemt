const mongoose = require('mongoose');

const idCardSchema = new mongoose.Schema({
  personType: { type: String, enum: ['student', 'staff'], required: true },
  personId: { type: mongoose.Schema.Types.ObjectId, required: true },
  cardNumber: { type: String, unique: true },
  issuedDate: { type: Date, default: Date.now },
  expiryDate: Date,
  isActive: { type: Boolean, default: true },
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
}, { timestamps: true });

module.exports = mongoose.model('IDCard', idCardSchema);
