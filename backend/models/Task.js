const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  type: {
    type: String,
    enum: ['watering', 'fertilizing', 'pruning', 'harvesting', 'planting', 'maintenance', 'other'],
    default: 'maintenance'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dueDate: Date,
  completedDate: Date,
  garden: { type: mongoose.Schema.Types.ObjectId, ref: 'Garden', required: true },
  estimatedDuration: Number, // in minutes
  actualDuration: Number, // in minutes
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema); 