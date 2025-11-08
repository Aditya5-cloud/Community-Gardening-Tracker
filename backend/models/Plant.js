const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  species: String,
  variety: String,
  plantedDate: { type: Date, default: Date.now },
  expectedHarvestDate: Date,
  status: {
    type: String,
    enum: ['seed', 'seedling', 'vegetative', 'flowering', 'fruiting', 'harvested', 'completed'],
    default: 'seed'
  },
  health: {
    type: String,
    enum: ['excellent', 'good', 'fair', 'poor', 'critical'],
    default: 'good'
  },
  location: String, // e.g., "Bed A", "Container 1"
  notes: String,
  garden: { type: mongoose.Schema.Types.ObjectId, ref: 'Garden', required: true },
  plantedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  lastWatered: Date,
  lastFertilized: Date
}, { timestamps: true });

module.exports = mongoose.model('Plant', plantSchema); 