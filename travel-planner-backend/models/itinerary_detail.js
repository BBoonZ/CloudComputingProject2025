const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Itinerary = require('./itinerary');

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
  description: DataTypes.TEXT,
  order_index: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  tableName: 'itinerary_detail',
  schema: 'aws',
  timestamps: false
});

module.exports = ItineraryDetail;
