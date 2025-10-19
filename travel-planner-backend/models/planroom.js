const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

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
    }
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: DataTypes.TEXT,
  total_budget: DataTypes.DECIMAL(10, 2),
  share_status: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  image: DataTypes.TEXT,
  start_date: DataTypes.DATEONLY,
  end_date: DataTypes.DATEONLY
}, {
  tableName: 'planroom',
  timestamps: false
});

module.exports = Planroom;
