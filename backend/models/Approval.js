const mongoose = require('mongoose');

const approvalSchema = new mongoose.Schema({
  type: { type: String, enum: ['leave', 'fee_concession', 'transfer', 'purchase', 'event'], required: true },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  title: { type: String, required: true },
  description: String,
  approvers: [{ userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }, comment: String, respondedAt: Date }],
  currentLevel: { type: Number, default: 0 },
  resolvedAt: Date,
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
}, { timestamps: true });

approvalSchema.index({ submittedBy: 1, status: 1 });

module.exports = mongoose.model('Approval', approvalSchema);
