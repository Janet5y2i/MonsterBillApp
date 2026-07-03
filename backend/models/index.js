// models/index.js
const sequelize = require('../config/database'); // 確保路徑能指到你的資料庫設定
const User = require('./User');
const Group = require('./Group');
const Record = require('./Record');
const SplitRecord = require('./SplitRecord');


//relationship betweeen User and Record
User.hasMany(Record, { foreignKey: 'userId' });
Record.belongsTo(User, { foreignKey: 'userId' });

//relationship between Group and Record
Group.hasMany(Record, { foreignKey: 'groupId' });
Record.belongsTo(Group, { foreignKey: 'groupId' });

//relationship between User and Group
User.belongsToMany(Group, { through: 'UserGroups' });
Group.belongsToMany(User, { through: 'UserGroups' });

//relationship between Record and User
Record.belongsToMany(User, { through: 'RecordSplits', as: 'SharedUsers' });
User.belongsToMany(Record, { through: 'RecordSplits' });

//relationship between Record and SplitRecord
Record.hasMany(SplitRecord, { foreignKey: 'recordId' });
SplitRecord.belongsTo(Record, { foreignKey: 'recordId' });

//relationship between User and SplitRecord
User.hasMany(SplitRecord, { foreignKey: 'userId' });
SplitRecord.belongsTo(User, { foreignKey: 'userId' });

module.exports = { sequelize, User , Group, Record, SplitRecord };
