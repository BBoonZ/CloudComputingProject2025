const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Planroom = require('./planroom');
const User = require('./user');

const Access = sequelize.define('Access', {
  access_id: {
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
  user_id: {
    type: DataTypes.CHAR(10),
    references: {
      model: User,
      key: 'user_id'
    },
    onDelete: 'CASCADE'
  },
  role: {
    type: DataTypes.STRING(50),
    defaultValue: 'member'
  }
}, {
  tableName: 'access',
  schema: 'aws',
  timestamps: false
});

module.exports = Access;
