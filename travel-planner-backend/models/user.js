const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.CHAR(10),
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING(100)
  },
  name: {
    type: DataTypes.STRING(100)
  },
  surname: {
    type: DataTypes.STRING(100)
  },
  phone_number: {
    type: DataTypes.STRING(100)
  },
  profile_uri: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'user',
  schema: 'aws',
  timestamps: false
});

module.exports = { User };