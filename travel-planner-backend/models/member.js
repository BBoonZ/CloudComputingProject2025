const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Planroom = require('./planroom');

const Member = sequelize.define('Member', {
  member_id: {
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
  member_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  photo: DataTypes.TEXT
}, {
  tableName: 'member',
  schema: 'aws',
  timestamps: false
});

module.exports = Member;
