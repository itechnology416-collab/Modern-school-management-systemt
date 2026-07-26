const mongoose = require('mongoose');

const salarySchema = new mongoose.Schema({
  staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  month: { type: String, required: true },
  year: { type: Number, required: true },
  basic: { type: Number, required: true, default: 0 },
  allowances: { type: Number, default: 0 },
  deductions: { type: Number, default: 0 },
  netPay: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'paid'], default: 'pending' },
  paidDate: Date,
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
}, { timestamps: true });

salarySchema.index({ staffId: 1, month: 1, year: 1 }, { unique: true });
salarySchema.index({ schoolId: 1, status: 1 });
salarySchema.index({ month: 1, year: 1 });
module.exports = mongoose.model('Salary', salarySchema);
