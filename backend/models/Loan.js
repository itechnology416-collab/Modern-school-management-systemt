const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  staffName: String,
  amount: { type: Number, required: true },
  reason: String,
  installment: Number,
  remainingAmount: { type: Number },
  status: { type: String, enum: ['pending', 'approved', 'repaid', 'rejected'], default: 'pending' },
  startDate: Date,
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Loan', loanSchema);
