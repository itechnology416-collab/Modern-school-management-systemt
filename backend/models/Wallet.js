const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  balance: { type: Number, default: 0, min: 0 },
  creditLimit: { type: Number, default: 0 },
  transactions: [{
    type: { type: String, enum: ['deposit', 'withdrawal', 'fee_payment', 'credit', 'adjustment'], required: true },
    amount: { type: Number, required: true },
    balanceAfter: Number,
    description: String,
    feeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Fee' },
    paymentMethod: { type: String, enum: ['cash', 'card', 'online', 'cheque', 'wallet'] },
    transactionId: String,
    processedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: { type: Date, default: Date.now },
  }],
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Wallet', walletSchema);
