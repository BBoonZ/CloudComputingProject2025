const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { User } = require('./user');

const Planroom = sequelize.define('Planroom', {
  room_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.CHAR(10),
    references: {
      model: User,
      key: 'user_id'
    },
    onDelete: 'CASCADE'
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: DataTypes.TEXT,
  total_budget: DataTypes.DECIMAL(12, 2),
  start_date: DataTypes.DATEONLY,
  end_date: DataTypes.DATEONLY,
  share_status: DataTypes.STRING(20),
  plan_url: {
    type: DataTypes.TEXT,
    defaultValue: 'https://travel-planner-profile-uploads.s3.amazonaws.com/default-trip.jpg'
  }
}, {
  tableName: 'planroom',
  schema: 'aws',
  timestamps: false
});

module.exports = { Planroom };