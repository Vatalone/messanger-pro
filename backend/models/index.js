import User from "./user.js";
import Message from './message.js'

User.associate = (models) => {
  User.hasMany(models.Message, { as: 'SentMessages', foreignKey: 'senderId' });
  User.hasMany(models.Message, { as: 'ReceivedMessages', foreignKey: 'receiverId' });
};

Message.associate = (models) => {
  Message.belongsTo(models.User, { as: 'Sender', foreignKey: 'senderId' });
  Message.belongsTo(models.User, { as: 'Receiver', foreignKey: 'receiverId' });
};

module.exports = {User, Message}