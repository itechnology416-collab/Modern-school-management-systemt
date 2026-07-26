const mongoose = require('mongoose');

const onlineClassSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  teacher: String,
  className: String,
  platform: { type: String, enum: ['Zoom', 'Google Meet', 'Jitsi', 'Microsoft Teams'], default: 'Zoom' },
  link: { type: String, required: true },
  date: Date,
  time: String,
  status: { type: String, enum: ['upcoming', 'live', 'completed'], default: 'upcoming' },
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
}, { timestamps: true });

module.exports = mongoose.model('OnlineClass', onlineClassSchema);
