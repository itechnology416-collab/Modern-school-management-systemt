const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: String,
  isbn: { type: String, unique: true },
  category: { type: String, required: true },
  publisher: String,
  publicationYear: Number,
  quantity: { type: Number, default: 1, min: 0 },
  available: { type: Number, default: 1, min: 0 },
  shelfNumber: String,
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
}, { timestamps: true });

bookSchema.index({ schoolId: 1, title: 1 });

module.exports = mongoose.model('Book', bookSchema);
