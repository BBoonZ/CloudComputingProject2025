const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./database');

async function initializeTables() {
  try {
    // Define User model
    const User = sequelize.define('User', {
      user_id: {
        type: DataTypes.CHAR(10),
        primaryKey: true
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
        type: DataTypes.TEXT()
      }
    }, {
      tableName: 'user',
      schema: 'aws',
      timestamps: false
    });

    // Define Planroom model
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
      start_date: DataTypes.DATE,
      end_date: DataTypes.DATE,
      share_status: DataTypes.STRING(20)
    }, {
      tableName: 'planroom',
      schema: 'aws',
      timestamps: false
    });

    // Define Member model
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
      member_name: DataTypes.STRING(100),
      photo: DataTypes.TEXT
    }, {
      tableName: 'member',
      schema: 'aws',
      timestamps: false
    });

    // Create schema if it doesn't exist
    await sequelize.query('CREATE SCHEMA IF NOT EXISTS aws');

    // Sync all models without dropping tables
    await sequelize.sync({ force: false }); // Changed to false to prevent dropping tables
    console.log('Database tables synchronized successfully');

    return { User, Planroom, Member };
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

module.exports = { initializeTables };