const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  category: { type: String, enum: ['campus', 'events', 'sports', 'classroom', 'ceremony', 'other'], default: 'campus' },
  description: String,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
  isPublished: { type: Boolean, default: true },
}, { timestamps: true });

gallerySchema.index({ schoolId: 1, category: 1 });

module.exports = mongoose.model('Gallery', gallerySchema);
