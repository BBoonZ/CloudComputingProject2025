const express = require('express');
const router = express.Router();
const { Planroom, Member, User } = require('../models');
const { Op, literal } = require('sequelize');
const { sequelize } = require('../models');

// Get all public trips with sorting
router.get('/public', async (req, res) => {
  try {
    const { 
      sortBy, 
      order = 'DESC',
      budgetMin,
      budgetMax,
      durationMin,
      durationMax,
      searchQuery
    } = req.query;

    let whereClause = {
      share_status: true
    };

    // Add budget filter
    if (budgetMin || budgetMax) {
      whereClause.total_budget = {};
      if (budgetMin) whereClause.total_budget[Op.gte] = parseFloat(budgetMin);
      if (budgetMax) whereClause.total_budget[Op.lte] = parseFloat(budgetMax);
    }

    // Add duration filter using date_part instead of extract
    if (durationMin || durationMax) {
      whereClause[Op.and] = literal(
        `date_part('day', age(end_date, start_date)) + 1 BETWEEN ${durationMin || 0} AND ${durationMax || 999}`
      );
    }

    // Add search query
    if (searchQuery) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${searchQuery}%` } },
        { '$User.name$': { [Op.iLike]: `%${searchQuery}%` } },
        { '$User.username$': { [Op.iLike]: `%${searchQuery}%` } }
      ];
    }

    let orderClause = [['start_date', order]];
    switch (sortBy) {
      case 'budget':
        orderClause = [['total_budget', order]];
        break;
      case 'duration':
        orderClause = [literal(`date_part('day', age(end_date, start_date)) + 1 ${order}`)];
        break;
      case 'members':
        orderClause = [literal(`(SELECT COUNT(*) FROM aws.member WHERE member.room_id = "Planroom".room_id) ${order}`)];
        break;
      case 'owner':
        orderClause = [[{ model: User }, 'name', order]];
        break;
      case 'title':
        orderClause = [['title', order]];
        break;
    }

    const trips = await Planroom.findAll({
      where: whereClause,
      include: [{
        model: Member,
        attributes: ['member_id', 'member_name']
      }, {
        model: User,
        attributes: ['username', 'name', 'profile_uri']
      }],
      order: orderClause
    });

    res.json({
      status: 'success',
      data: trips
    });
  } catch (error) {
    console.error('Error fetching trips:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Search public trips
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    const trips = await Planroom.findAll({
      where: {
        share_status: true,
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