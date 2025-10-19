const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Planroom = require('./planroom');

const Share = sequelize.define('Share', {
  share_id: {
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
  mode: DataTypes.STRING(50),
  link: DataTypes.TEXT
}, {
  tableName: 'share',
  schema: 'aws',
  timestamps: false
});

module.exports = Share;
