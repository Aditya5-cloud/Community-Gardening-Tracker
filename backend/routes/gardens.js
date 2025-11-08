const express = require('express');
const { body, validationResult } = require('express-validator');
const Garden = require('../models/Garden');
const auth = require('../middleware/auth');
const router = express.Router();

// Create a new garden
router.post(
  '/',
  auth,
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('location').notEmpty().withMessage('Location is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      console.log('Creating garden with data:', req.body);
      console.log('User ID:', req.user.id);
      
      const garden = new Garden({
        ...req.body,
        owner: req.user.id,
        members: [req.user.id]
      });
      
      console.log('Garden object before save:', garden);
      await garden.save();
      console.log('Garden saved successfully:', garden._id);
      console.log('Garden owner after save:', garden.owner);
      console.log('Garden members after save:', garden.members);
      
      // Populate the garden data before sending response
      const populatedGarden = await Garden.findById(garden._id)
        .populate('owner', 'username firstName lastName')
        .populate('members', 'username firstName lastName');
      
      res.status(201).json(populatedGarden);
    } catch (err) {
      console.error('Error creating garden:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Get garden by ID with statistics
router.get('/:id', async (req, res) => {
  try {
    console.log('Fetching garden with ID:', req.params.id);

    const garden = await Garden.findById(req.params.id)
      .populate('owner', 'username firstName lastName')
      .populate('members', 'username firstName lastName');

    if (!garden) {
      console.log('Garden not found for ID:', req.params.id);
      return res.status(404).json({ message: 'Garden not found' });
    }

    console.log('Garden found:', garden.name);
    console.log('Garden owner:', garden.owner);
    console.log('Garden members:', garden.members);

    // Get real-time statistics
    const Plant = require('../models/Plant');
    const Event = require('../models/Event');
    const Task = require('../models/Task');

    const [plants, events, tasks] = await Promise.all([
      Plant.find({ garden: req.params.id }),
      Event.find({ garden: req.params.id }),
      Task.find({ garden: req.params.id })
    ]);

    const stats = {
      totalMembers: garden.members.length,
      activeMembers: garden.members.length,
      totalPlants: plants.length,
      upcomingEvents: events.filter(e => e.status === 'upcoming' && new Date(e.date) > new Date()).length,
      completedTasks: tasks.filter(t => t.status === 'completed').length,
      pendingTasks: tasks.filter(t => t.status === 'pending').length
    };

    res.json({
      ...garden.toObject(),
      stats
    });
  } catch (err) {
    console.error('Error in garden route:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get gardens owned by the user
router.get('/user/my-gardens', auth, async (req, res) => {
  try {
    const gardens = await Garden.find({ 
      $or: [
        { owner: req.user.id },
        { members: req.user.id }
      ]
    });
    res.json(gardens);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get gardens created by the user
router.get('/user/created', auth, async (req, res) => {
  try {
    const gardens = await Garden.find({ owner: req.user.id });
    res.json(gardens);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all gardens (for listing/joining) with member count
router.get('/', async (req, res) => {
  try {
    const gardens = await Garden.aggregate([
      {
        $project: {
          name: 1,
          description: 1,
          location: 1,
          category: 1,
          createdAt: 1,
          owner: 1, // <-- FIXED: Added owner field to the projection
          memberCount: { $size: { "$ifNull": ["$members", []] } }
        }
      }
    ]);
    res.json(gardens);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Debug route to check if garden exists
router.get('/debug/:id', async (req, res) => {
  try {
    const garden = await Garden.findById(req.params.id);
    if (!garden) {
      return res.status(404).json({ message: 'Garden not found in database' });
    }
    res.json({ 
      message: 'Garden found', 
      id: garden._id, 
      name: garden.name,
      owner: garden.owner,
      members: garden.members
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Join a garden
router.post('/:gardenId/members', auth, async (req, res) => {
  try {
    const garden = await Garden.findById(req.params.gardenId);
    if (!garden) return res.status(404).json({ message: 'Garden not found' });
    if (!garden.members.includes(req.user.id)) {
      garden.members.push(req.user.id);
      await garden.save();
    }
    res.json(garden);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Leave a garden
router.post('/:id/leave', auth, async (req, res) => {
  try {
    const garden = await Garden.findById(req.params.id);
    if (!garden) return res.status(404).json({ message: 'Garden not found' });

    garden.members = garden.members.filter(
      memberId => memberId.toString() !== req.user.id
    );
    await garden.save();
    res.json({ message: 'Left the garden successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a garden (only owner)
router.delete('/:id', auth, async (req, res) => {
  try {
    const garden = await Garden.findById(req.params.id);
    if (!garden) return res.status(404).json({ message: 'Garden not found' });
    if (garden.owner.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not authorized' });

    await garden.deleteOne();
    res.json({ message: 'Garden deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;