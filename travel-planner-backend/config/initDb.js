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
        type: DataTypes.TEXT
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

    // Define Itinerary model
    const Itinerary = sequelize.define('Itinerary', {
      itinerary_id: {
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
      title: DataTypes.STRING(255),
      map: DataTypes.TEXT,
      location: DataTypes.STRING(255),
      time: DataTypes.DATE
    }, {
      tableName: 'itinerary',
      schema: 'aws',
      timestamps: false
    });

    // Define ItineraryDetail model
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
      description: DataTypes.TEXT
    }, {
      tableName: 'itinerary_detail',
      schema: 'aws',
      timestamps: false
    });

    // Define Expend model
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
      value: DataTypes.DECIMAL(12, 2),
      type: DataTypes.STRING(50)
    }, {
      tableName: 'expend',
      schema: 'aws',
      timestamps: false
    });

    // Define Document model
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
      schema: 'aws',
      timestamps: false
    });

    // Define Share model
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

    // Define Access model
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
      role: DataTypes.STRING(50)
    }, {
      tableName: 'access',
      schema: 'aws',
      timestamps: false
    });

    // Define associations
    User.hasMany(Planroom, { foreignKey: 'user_id' });
    Planroom.belongsTo(User, { foreignKey: 'user_id' });

    Planroom.hasMany(Member, { foreignKey: 'room_id' });
    Member.belongsTo(Planroom, { foreignKey: 'room_id' });

    Planroom.hasMany(Itinerary, { foreignKey: 'room_id' });
    Itinerary.belongsTo(Planroom, { foreignKey: 'room_id' });

    Itinerary.hasMany(ItineraryDetail, { foreignKey: 'itinerary_id' });
    ItineraryDetail.belongsTo(Itinerary, { foreignKey: 'itinerary_id' });

    Planroom.hasMany(Expend, { foreignKey: 'room_id' });
    Expend.belongsTo(Planroom, { foreignKey: 'room_id' });
    Member.hasMany(Expend, { foreignKey: 'member_id' });
    Expend.belongsTo(Member, { foreignKey: 'member_id' });

    Planroom.hasMany(Document, { foreignKey: 'room_id' });
    Document.belongsTo(Planroom, { foreignKey: 'room_id' });

    Planroom.hasMany(Share, { foreignKey: 'room_id' });
    Share.belongsTo(Planroom, { foreignKey: 'room_id' });

    Planroom.hasMany(Access, { foreignKey: 'room_id' });
    Access.belongsTo(Planroom, { foreignKey: 'room_id' });
    User.hasMany(Access, { foreignKey: 'user_id' });
    Access.belongsTo(User, { foreignKey: 'user_id' });

    // Create schema if it doesn't exist
    await sequelize.query('CREATE SCHEMA IF NOT EXISTS aws');

    // Sync all models without dropping tables
    await sequelize.sync({ force: true });
    console.log('Database tables synchronized successfully');

    return {
      User,
      Planroom,
      Member,
      Itinerary,
      ItineraryDetail,
      Expend,
      Document,
      Share,
      Access
    };
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

module.exports = { initializeTables };