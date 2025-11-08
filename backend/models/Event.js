const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  date: { type: Date, required: true },
  time: String,
  duration: Number, // in minutes
  type: {
    type: String,
    enum: ['workday', 'workshop', 'harvest', 'celebration', 'maintenance', 'other'],
    default: 'workday'
  },
  location: String,
  maxAttendees: Number,
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  garden: { type: mongoose.Schema.Types.ObjectId, ref: 'Garden', required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema); 