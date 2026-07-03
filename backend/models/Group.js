const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 


const Group = sequelize.define('Group', {
    id : {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
     groupName: {
        type: DataTypes.STRING,
        allowNull: false
     }
});

module.exports = Group;