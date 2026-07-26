const mongoose = require('mongoose');
const { softDeletePlugin } = require('../middleware/softDelete');

const feeSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
    },
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
    },
    feeType: {
      type: String,
      enum: ['tuition', 'exam', 'library', 'sports', 'transport', 'hostel', 'other'],
      required: true,
    },
    feeName: {
      type: String,
      required: true,
      trim: true,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    paidAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    concessionAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    previousAmount: Number,
    discountReason: String,
    dueDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'partial', 'paid', 'overdue'],
      default: 'pending',
    },
    academicYear: {
      type: String,
    },
    term: {
      type: String,
      enum: ['term-1', 'term-2', 'term-3', 'annual'],
    },
    paymentHistory: [
      {
        amount: Number,
        paymentDate: { type: Date, default: Date.now },
        paymentMethod: { type: String, enum: ['cash', 'card', 'online', 'cheque'] },
        transactionId: String,
        receivedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        remark: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

feeSchema.index({ studentId: 1 });
feeSchema.index({ schoolId: 1, status: 1 });
feeSchema.index({ classId: 1 });
feeSchema.index({ academicYear: 1, term: 1 });
feeSchema.index({ dueDate: 1 });

feeSchema.plugin(softDeletePlugin);

module.exports = mongoose.model('Fee', feeSchema);
