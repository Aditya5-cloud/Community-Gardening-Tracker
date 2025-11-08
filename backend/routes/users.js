const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users (admin only)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // Check if user is admin
    const currentUser = await User.findById(req.user.id);
    if (currentUser.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { page = 1, limit = 20, role, experience, isActive } = req.query;
    
    const filter = {};
    if (role) filter.role = role;
    if (experience) filter.experience = experience;
    if (isActive !== undefined) filter.isActive = isActive;

    const users = await User.find(filter)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(filter);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('gardens', 'name description')
      .populate('tasks', 'title status dueDate')
      .populate('events', 'title startDate endDate');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/:id
// @desc    Update user (admin or self)
// @access  Private
router.put('/:id', auth, [
  body('firstName')
    .optional()
    .notEmpty()
    .withMessage('First name cannot be empty'),
  body('lastName')
    .optional()
    .notEmpty()
    .withMessage('Last name cannot be empty'),
  body('role')
    .optional()
    .isIn(['admin', 'moderator', 'member'])
    .withMessage('Invalid role'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const currentUser = await User.findById(req.user.id);
    const targetUser = await User.findById(req.params.id);

    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check authorization
    if (req.user.id !== req.params.id && currentUser.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this user' });
    }

    // Only admins can change roles and active status
    if (req.body.role && currentUser.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to change user role' });
    }

    if (req.body.isActive !== undefined && currentUser.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to change user status' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).select('-password');

    res.json(updatedUser);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/users/:id
// @desc    Delete user (admin only)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    if (currentUser.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent admin from deleting themselves
    if (req.user.id === req.params.id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    await user.remove();
    res.json({ message: 'User removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/search
// @desc    Search users
// @access  Private
router.get('/search', auth, async (req, res) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;
    
    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const filter = {
      $or: [
        { firstName: { $regex: q, $options: 'i' } },
        { lastName: { $regex: q, $options: 'i' } },
        { username: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } }
      ],
      isActive: true
    };

    const users = await User.find(filter)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ firstName: 1, lastName: 1 });

    const total = await User.countDocuments(filter);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/garden/:gardenId/members
// @desc    Get garden members
// @access  Private
router.get('/garden/:gardenId/members', auth, async (req, res) => {
  try {
    const Garden = require('../models/Garden');
    const garden = await Garden.findById(req.params.gardenId)
      .populate('members.user', 'firstName lastName username profilePicture experience interests');

    if (!garden) {
      return res.status(404).json({ message: 'Garden not found' });
    }

    // Check if user has access to the garden
    const member = garden.members.find(m => m.user._id.toString() === req.user.id);
    if (!member) {
      return res.status(403).json({ message: 'Not authorized to view garden members' });
    }

    res.json(garden.members);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/stats
// @desc    Get user statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('gardens')
      .populate('tasks')
      .populate('events');

    const stats = {
      totalGardens: user.gardens.length,
      totalTasks: user.tasks.length,
      totalEvents: user.events.length,
      completedTasks: user.tasks.filter(task => task.status === 'completed').length,
      upcomingEvents: user.events.filter(event => 
        new Date(event.startDate) > new Date()
      ).length,
      experience: user.experience,
      interests: user.interests
    };

    res.json(stats);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/users/:id/deactivate
// @desc    Deactivate user account
// @access  Private
router.post('/:id/deactivate', auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const targetUser = await User.findById(req.params.id);

    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check authorization
    if (req.user.id !== req.params.id && currentUser.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to deactivate this user' });
    }

    targetUser.isActive = false;
    await targetUser.save();

    res.json({ message: 'User account deactivated' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/users/:id/activate
// @desc    Activate user account (admin only)
// @access  Private
router.post('/:id/activate', auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    if (currentUser.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    targetUser.isActive = true;
    await targetUser.save();

    res.json({ message: 'User account activated' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 