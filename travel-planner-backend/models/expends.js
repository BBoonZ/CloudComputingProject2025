const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Planroom = require('./planroom');
const Member = require('./member');

const Expend = sequelize.define('Expend', {
  expend_id: {
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
  member_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Member,
      key: 'member_id'
    },
    onDelete: 'SET NULL'
  },
  description: DataTypes.TEXT,
  value: DataTypes.DECIMAL(10, 2),
  type: DataTypes.STRING(50),
  paydate: DataTypes.DATEONLY
}, {
  tableName: 'expend',
  schema: 'aws',
  timestamps: false
});

module.exports = Expend;
