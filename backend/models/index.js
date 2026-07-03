// models/index.js
const sequelize = require('../config/database'); 
const User = require('./User');
const Group = require('./Group');
const Record = require('./Record');
const SplitRecord = require('./SplitRecord');




User.hasMany(Record, { foreignKey: 'payerId', as: 'PaidRecords' });
Record.belongsTo(User, { foreignKey: 'payerId', as: 'Payer' });


User.hasMany(Record, { foreignKey: 'creatorId', as: 'CreatedRecords' });
Record.belongsTo(User, { foreignKey: 'creatorId', as: 'Creator' });

// =============================================


Group.hasMany(Record, { foreignKey: 'groupId' });
Record.belongsTo(Group, { foreignKey: 'groupId' });


User.belongsToMany(Group, { through: 'UserGroups' });
Group.belongsToMany(User, { through: 'UserGroups' });


Record.hasMany(SplitRecord, { foreignKey: 'recordId', onDelete: 'CASCADE' });
SplitRecord.belongsTo(Record, { foreignKey: 'recordId' });


User.hasMany(SplitRecord, { foreignKey: 'userId' });
SplitRecord.belongsTo(User, { foreignKey: 'userId' });

module.exports = { sequelize, User , Group, Record, SplitRecord };