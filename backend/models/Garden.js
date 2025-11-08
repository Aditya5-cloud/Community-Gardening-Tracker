const mongoose = require('mongoose');

const gardenSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  location: String,
  size: String,
  soilType: String,
  climate: String,
  category: {
    type: String,
    enum: ['community', 'urban', 'school', 'therapeutic', 'rooftop', 'vertical'],
    default: 'community'
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  plants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Plant' }],
  events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }]
}, { timestamps: true });

module.exports = mongoose.model('Garden', gardenSchema);