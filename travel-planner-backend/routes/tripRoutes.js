const express = require('express');
const router = express.Router();
const { Planroom, Member, User } = require('../models');
const { Op } = require('sequelize');

// Get all public trips
router.get('/public', async (req, res) => {
  try {
    const trips = await Planroom.findAll({
      where: {
        share_status: 'public'
      },
      include: [{
        model: Member,
        attributes: ['member_id', 'member_name']
      }, {
        model: User,
        attributes: ['username', 'name']
      }],
      order: [['start_date', 'DESC']]
    });

    res.json({
      status: 'success',
      data: trips
    });
  } catch (error) {
    console.error('Error fetching trips:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

// Search public trips
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    const trips = await Planroom.findAll({
      where: {
        share_status: 'public',
        [Op.or]: [
          { title: { [Op.iLike]: `%${query}%` } },
          { description: { [Op.iLike]: `%${query}%` } }
        ]
      },
      include: [{
        model: Member,
        attributes: ['member_id', 'member_name']
      }, {
        model: User,
        attributes: ['username', 'name']
      }],
      order: [['start_date', 'DESC']]
    });

    res.json({
      status: 'success',
      data: trips
    });
  } catch (error) {
    console.error('Error searching trips:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

module.exports = router;