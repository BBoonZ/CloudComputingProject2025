const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { User } = require('./user');
const { Planroom } = require('./planroom');
const { Member } = require('./member');
const { Itinerary, ItineraryDetail } = require('./itinerary');

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

module.exports = {
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