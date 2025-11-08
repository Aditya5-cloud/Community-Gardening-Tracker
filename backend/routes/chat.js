const express = require('express');
const { body, validationResult } = require('express-validator');
const Message = require('../models/Message');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all messages for a garden
router.get('/garden/:gardenId', auth, async (req, res) => {
  try {
    const messages = await Message.find({ garden: req.params.gardenId })
      .populate('user', 'username firstName lastName profilePicture')
      .sort({ createdAt: 'asc' });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Post a new message
router.post('/garden/:gardenId', auth, [
  body('text').notEmpty().withMessage('Message text is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const message = new Message({
      text: req.body.text,
      user: req.user.id,
      garden: req.params.gardenId
    });
    await message.save();
    
    const populatedMessage = await Message.findById(message._id)
    .populate('user', 'username firstName lastName profilePicture');

    // In a real-world app, you'd use WebSockets to broadcast the message.
    // For this example, we'll just return the new message.
    res.status(201).json(populatedMessage);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;