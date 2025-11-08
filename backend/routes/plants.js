const express = require('express');
const { body, validationResult } = require('express-validator');
const Plant = require('../models/Plant');
const Garden = require('../models/Garden');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all plants for a garden
router.get('/garden/:gardenId', auth, async (req, res) => {
  try {
    const plants = await Plant.find({ garden: req.params.gardenId })
      .populate('plantedBy', 'firstName lastName')
      .sort({ createdAt: -1 });
    res.json(plants);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a new plant
router.post('/garden/:gardenId', auth, [
  body('name').notEmpty().withMessage('Plant name is required'),
  body('species').notEmpty().withMessage('Species is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const garden = await Garden.findById(req.params.gardenId);
    if (!garden) return res.status(404).json({ message: 'Garden not found' });

    const plant = new Plant({
      ...req.body,
      garden: req.params.gardenId,
      plantedBy: req.user.id
    });
    await plant.save();

    // Update garden's plants array
    garden.plants.push(plant._id);
    await garden.save();

    res.status(201).json(plant);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update plant status
router.patch('/:plantId', auth, async (req, res) => {
  try {
    const plant = await Plant.findByIdAndUpdate(
      req.params.plantId,
      req.body,
      { new: true }
    );
    if (!plant) return res.status(404).json({ message: 'Plant not found' });
    res.json(plant);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete plant
router.delete('/:plantId', auth, async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.plantId);
    if (!plant) return res.status(404).json({ message: 'Plant not found' });

    await Plant.findByIdAndDelete(req.params.plantId);
    
    // Remove from garden's plants array
    const garden = await Garden.findById(plant.garden);
    if (garden) {
      garden.plants = garden.plants.filter(p => p.toString() !== plant._id.toString());
      await garden.save();
    }

    res.json({ message: 'Plant deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;