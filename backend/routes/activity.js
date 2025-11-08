const express = require('express');
const Event = require('../models/Event');
const Plant = require('../models/Plant');
const Task = require('../models/Task');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 }).limit(5).populate('createdBy', 'username');
    const plants = await Plant.find().sort({ createdAt: -1 }).limit(5).populate('plantedBy', 'username');
    const tasks = await Task.find().sort({ createdAt: -1 }).limit(5).populate('assignedBy', 'username');

    const activity = [...events, ...plants, ...tasks]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10);

    res.json(activity);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;