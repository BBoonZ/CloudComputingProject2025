const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Planroom = require('./planroom');

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
  title: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  map: DataTypes.TEXT,
  location: DataTypes.TEXT,
  time: DataTypes.TIME
}, {
  tableName: 'itinerary',
  timestamps: false
});

module.exports = Itinerary;
