const express = require('express');
const { body, validationResult } = require('express-validator');
const Event = require('../models/Event');
const Garden = require('../models/Garden');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all events for a garden
router.get('/garden/:gardenId', auth, async (req, res) => {
  try {
    const events = await Event.find({ garden: req.params.gardenId })
      .populate('createdBy', 'firstName lastName')
      .populate('attendees', 'firstName lastName')
      .sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a new event
router.post('/garden/:gardenId', auth, [
  body('title').notEmpty().withMessage('Event title is required'),
  body('date').notEmpty().withMessage('Event date is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const garden = await Garden.findById(req.params.gardenId);
    if (!garden) return res.status(404).json({ message: 'Garden not found' });

    const event = new Event({
      ...req.body,
      garden: req.params.gardenId,
      createdBy: req.user.id,
      attendees: [req.user.id] // Creator automatically attends
    });
    await event.save();

    // Update garden's events array
    garden.events.push(event._id);
    await garden.save();

    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Join/leave event
router.patch('/:eventId/attend', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const isAttending = event.attendees.includes(req.user.id);
    
    if (isAttending) {
      event.attendees = event.attendees.filter(id => id.toString() !== req.user.id);
    } else {
      event.attendees.push(req.user.id);
    }
    
    await event.save();
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update event
router.patch('/:eventId', auth, async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.eventId,
      req.body,
      { new: true }
    );
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete event
router.delete('/:eventId', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    await Event.findByIdAndDelete(req.params.eventId);
    
    // Remove from garden's events array
    const garden = await Garden.findById(event.garden);
    if (garden) {
      garden.events = garden.events.filter(e => e.toString() !== event._id.toString());
      await garden.save();
    }

    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 