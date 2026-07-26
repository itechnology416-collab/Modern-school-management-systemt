const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Parent',
    },
    rollNo: {
      type: Number,
      required: true,
    },
    admissionDate: {
      type: Date,
      default: Date.now,
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    bloodGroup: {
      type: String,
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
    },
    guardianName: String,
    guardianPhone: String,
    medicalInfo: String,
    documents: [{
      url: String,
      name: String,
      type: String,
      uploadedAt: { type: Date, default: Date.now },
    }],
    photo: String,
    medicalRecord: {
      bloodGroup: String,
      allergies: String,
      conditions: String,
      medications: String,
      emergencyContact: String,
      emergencyPhone: String,
      doctorName: String,
      doctorPhone: String,
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

module.exports = mongoose.model('Student', studentSchema);
