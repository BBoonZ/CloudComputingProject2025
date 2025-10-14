const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Planroom = require('./planroom');

const Document = sequelize.define('Document', {
  doc_id: {
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
  file: DataTypes.TEXT
}, {
  tableName: 'document',
  timestamps: false
});

module.exports = Document;
