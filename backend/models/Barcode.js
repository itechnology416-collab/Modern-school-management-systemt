const mongoose = require('mongoose');

const barcodeSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  barcode: { type: String, required: true, unique: true },
  barcodeType: { type: String, enum: ['code128', 'qr-code', 'code39', 'pdf417'], default: 'code128' },
  issuedDate: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Barcode', barcodeSchema);
