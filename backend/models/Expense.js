const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  amount: { type: Number, required: true, min: 0 },
  category: { type: String, enum: ['salary','utilities','maintenance','supplies','transport','events','misc'], required: true },
  date: { type: Date, required: true, default: Date.now },
  description: String,
  receipt: String,
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

expenseSchema.index({ schoolId: 1, date: -1 });
expenseSchema.index({ category: 1 });
module.exports = mongoose.model('Expense', expenseSchema);
