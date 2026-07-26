const mongoose = require('mongoose');

const biometricDeviceSchema = new mongoose.Schema({
  deviceName: { type: String, required: true },
  deviceId: { type: String, required: true, unique: true },
  deviceType: { type: String, enum: ['fingerprint', 'face', 'iris', 'palm'], required: true },
  location: String,
  ipAddress: String,
  port: String,
  status: { type: String, enum: ['online', 'offline', 'maintenance'], default: 'offline' },
  lastSync: Date,
  recordsPulled: { type: Number, default: 0 },
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('BiometricDevice', biometricDeviceSchema);
