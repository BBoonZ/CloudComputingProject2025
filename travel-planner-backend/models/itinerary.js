const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { Planroom } = require('./planroom');

const Itinerary = sequelize.define('Itinerary', {
  itinerary_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  room_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Planroom,
      key: 'room_id'
    },
    onDelete: 'CASCADE'
  },
  title: DataTypes.STRING(255),
  map: DataTypes.TEXT,
  location: DataTypes.STRING(255),
  time: DataTypes.DATE
}, {
  tableName: 'itinerary',
  schema: 'aws',
  timestamps: false
});

const ItineraryDetail = sequelize.define('ItineraryDetail', {
  detail_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  itinerary_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Itinerary,
      key: 'itinerary_id'
    },
    onDelete: 'CASCADE'
  },
  description: DataTypes.TEXT
}, {
  tableName: 'itinerary_detail',
  schema: 'aws',
  timestamps: false
});

module.exports = { Itinerary, ItineraryDetail };