const express = require('express');
const { body, validationResult } = require('express-validator');
const Task = require('../models/Task');
const Garden = require('../models/Garden');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all tasks for a garden
router.get('/garden/:gardenId', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ garden: req.params.gardenId })
      .populate('assignedTo', 'firstName lastName')
      .populate('assignedBy', 'firstName lastName')
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a new task
router.post('/garden/:gardenId', auth, [
  body('title').notEmpty().withMessage('Task title is required'),
  body('type').notEmpty().withMessage('Task type is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const garden = await Garden.findById(req.params.gardenId);
    if (!garden) return res.status(404).json({ message: 'Garden not found' });

    const task = new Task({
      ...req.body,
      garden: req.params.gardenId,
      assignedBy: req.user.id
    });
    await task.save();

    // Update garden's tasks array
    garden.tasks.push(task._id);
    await garden.save();

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update task status
router.patch('/:taskId/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    task.status = status;
    if (status === 'completed') {
      task.completedDate = new Date();
    }
    
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update task
router.patch('/:taskId', auth, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.taskId,
      req.body,
      { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete task
router.delete('/:taskId', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    await Task.findByIdAndDelete(req.params.taskId);
    
    // Remove from garden's tasks array
    const garden = await Garden.findById(task.garden);
    if (garden) {
      garden.tasks = garden.tasks.filter(t => t.toString() !== task._id.toString());
      await garden.save();
    }

    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;