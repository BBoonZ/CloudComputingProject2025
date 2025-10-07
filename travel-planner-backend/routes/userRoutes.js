const express = require('express');
const router = express.Router();
const { User } = require('../models/user');

// Get user by email
router.get('/:email', async (req, res) => {
  try {
    const { email } = req.params;
    
    if (!email) {
      return res.status(400).json({ 
        status: 'error',
        message: 'Email is required' 
      });
    }

    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(404).json({ 
        status: 'error',
        message: 'User not found' 
      });
    }

    res.json({
      status: 'success',
      data: user
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Internal server error',
      error: error.message 
    });
  }
});

// Create new user
router.post('/', async (req, res) => {
  try {
    const { email, username, name, surname, phone_number } = req.body;

    if (!email) {
      return res.status(400).json({
        status: 'error',
        message: 'Email is required'
      });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        status: 'error',
        message: 'User already exists'
      });
    }

    const user = await User.create({
      user_id: Math.random().toString(36).substring(2, 12).toUpperCase(),
      email,
      username: username || email.split('@')[0],
      name,
      surname,
      phone_number
    });

    res.status(201).json({
      status: 'success',
      data: user
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Update user
router.put('/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const updateData = req.body;

    if (!email) {
      return res.status(400).json({
        status: 'error',
        message: 'Email is required'
      });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    await user.update(updateData);

    res.json({
      status: 'success',
      data: user
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message
    });
  }
});

module.exports = router;