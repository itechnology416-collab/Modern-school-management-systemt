const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'School name is required'],
      trim: true,
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    email: {
      type: String,
      required: [true, 'School email is required'],
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, 'School phone is required'],
    },
    logo: {
      type: String,
      default: '',
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    otpVerified: {
      type: Boolean,
      default: false,
    },
    settings: {
      schoolHours: {
        start: { type: String, default: '08:00' },
        end: { type: String, default: '15:00' },
      },
      workingDays: {
        type: [String],
        default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      },
      timezone: { type: String, default: 'UTC' },
      currency: { type: String, default: 'INR' },
      academicYear: { type: String },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('School', schoolSchema);
