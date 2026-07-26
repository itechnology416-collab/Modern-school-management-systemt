const mongoose = require('mongoose');

const transportSchema = new mongoose.Schema({
  routeName: { type: String, required: true },
  vehicleNumber: { type: String, required: true },
  driverName: String,
  driverPhone: String,
  capacity: { type: Number, default: 30 },
  fee: { type: Number, default: 0 },
  stops: [{ name: String, time: String }],
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Transport', transportSchema);
