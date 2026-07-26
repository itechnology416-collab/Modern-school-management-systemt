const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String, unique: true },
  category: { type: String, required: true },
  quantity: { type: Number, default: 0, min: 0 },
  price: { type: Number, required: true },
  costPrice: { type: Number },
  minStockLevel: { type: Number, default: 5 },
  description: String,
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
