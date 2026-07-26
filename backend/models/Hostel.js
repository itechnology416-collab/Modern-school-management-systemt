const mongoose = require('mongoose');

const hostelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['boys', 'girls', 'co-ed'], required: true },
  capacity: { type: Number, default: 50 },
  occupied: { type: Number, default: 0 },
  wardenName: String,
  wardenPhone: String,
  monthlyFee: { type: Number, default: 0 },
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Hostel', hostelSchema);
