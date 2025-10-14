const User = require('./user');
const Planroom = require('./planroom');
const Access = require('./access');
const Member = require('./member');
const Expend = require('./expend');
const Itinerary = require('./itinerary');
const ItineraryDetail = require('./itinerary_detail');
const Document = require('./document');
const Share = require('./share');

// 🧠 Associations
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
Itinerary.hasMany(require('./itinerary_detail'), { foreignKey: 'itinerary_id' });

module.exports = {
  User,
  Planroom,
  Access,
  Member,
  Expend,
  Itinerary,
  ItineraryDetail,
  Document,
  Share
};
