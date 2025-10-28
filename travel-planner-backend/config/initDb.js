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

const Planroom = sequelize.define('Planroom', {
      room_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: DataTypes.CHAR(10),
        references: { model: User, key: 'user_id' },
        onDelete: 'CASCADE'
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
      schema: 'aws',
      timestamps: false
    });

    // 3️⃣ ตาราง access
    const Access = sequelize.define('Access', {
      access_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      room_id: {
        type: DataTypes.INTEGER,
        references: { model: Planroom, key: 'room_id' },
        onDelete: 'CASCADE'
      },
      user_id: {
        type: DataTypes.CHAR(10),
        references: { model: User, key: 'user_id' },
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

    // 4️⃣ ตาราง member
    const Member = sequelize.define('Member', {
      member_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      room_id: {
        type: DataTypes.INTEGER,
        references: { model: Planroom, key: 'room_id' },
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

    // 5️⃣ ตาราง expend
    const Expend = sequelize.define('Expend', {
      expend_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      room_id: {
        type: DataTypes.INTEGER,
        references: { model: Planroom, key: 'room_id' },
        onDelete: 'CASCADE'
      },
      member_id: {
        type: DataTypes.INTEGER,
        references: { model: Member, key: 'member_id' },
        onDelete: 'SET NULL'
      },
      description: DataTypes.TEXT,
      value: DataTypes.DECIMAL(10, 2),
      type: DataTypes.STRING(50),
      paydate: DataTypes.DATEONLY
    },    
    {
      tableName: 'expend',
      schema: 'aws',
      timestamps: false
    });

    // 6️⃣ ตาราง itinerary
    const Itinerary = sequelize.define('Itinerary', {
      itinerary_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      room_id: {
        type: DataTypes.INTEGER,
        references: { model: Planroom, key: 'room_id' },
        onDelete: 'CASCADE'
      },
      title: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      map: DataTypes.TEXT,
      location: DataTypes.TEXT,
      time: DataTypes.TIME,
      date: {
      type: DataTypes.DATEONLY,
      allowNull: false // หรือตั้งเป็น false ถ้าบังคับว่าต้องมี
    }
    }, {
      tableName: 'itinerary',
      schema: 'aws',
      timestamps: false
    });

    // 7️⃣ ตาราง itinerary_detail
    const ItineraryDetail = sequelize.define('ItineraryDetail', {
      detail_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      itinerary_id: {
        type: DataTypes.INTEGER,
        references: { model: Itinerary, key: 'itinerary_id' },
        onDelete: 'CASCADE'
      },
      description: DataTypes.TEXT,
      order_index: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
    }, {
      tableName: 'itinerary_detail',
      schema: 'aws',
      timestamps: false
    });

    // 8️⃣ ตาราง document
    const Document = sequelize.define('Document', {
      doc_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      room_id: {
        type: DataTypes.INTEGER,
        references: { model: Planroom, key: 'room_id' },
        onDelete: 'CASCADE'
      },
      file: DataTypes.TEXT
    }, {
      tableName: 'document',
      schema: 'aws',
      timestamps: false
    });

    // 9️⃣ ตาราง share
    const Share = sequelize.define('Share', {
      share_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      room_id: {
        type: DataTypes.INTEGER,
        references: { model: Planroom, key: 'room_id' },
        onDelete: 'CASCADE'
      },
      mode: DataTypes.STRING(50),
      link: DataTypes.TEXT
    }, {
      tableName: 'share',
      schema: 'aws',
      timestamps: false
    });

    // 🔗 ความสัมพันธ์ (Associations)
    User.hasMany(Planroom, { foreignKey: 'user_id' });
    Planroom.belongsTo(User, { foreignKey: 'user_id' });

    Planroom.hasMany(Access, { foreignKey: 'room_id' });
    Planroom.hasMany(Member, { foreignKey: 'room_id' });
    Planroom.hasMany(Expend, { foreignKey: 'room_id' });
    Planroom.hasMany(Itinerary, { foreignKey: 'room_id' });
    Planroom.hasMany(Document, { foreignKey: 'room_id' });
    Planroom.hasMany(Share, { foreignKey: 'room_id' });

    Access.belongsTo(User, { foreignKey: 'user_id' });
    Access.belongsTo(Planroom, { foreignKey: 'room_id' });

    Member.belongsTo(Planroom, { foreignKey: 'room_id' });
    Expend.belongsTo(Member, { foreignKey: 'member_id' });
    Expend.belongsTo(Planroom, { foreignKey: 'room_id' });

    Itinerary.belongsTo(Planroom, { foreignKey: 'room_id' });
    Itinerary.hasMany(ItineraryDetail, { foreignKey: 'itinerary_id' });
    ItineraryDetail.belongsTo(Itinerary, { foreignKey: 'itinerary_id' });

    Document.belongsTo(Planroom, { foreignKey: 'room_id' });
    Share.belongsTo(Planroom, { foreignKey: 'room_id' });

    // Create schema if it doesn't exist
    await sequelize.query('CREATE SCHEMA IF NOT EXISTS aws');

    // Sync all models without dropping tables
    await sequelize.sync({ force: false });
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