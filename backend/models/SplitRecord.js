const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 

const SplitRecord = sequelize.define('SplitRecord', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
});

module.exports = SplitRecord;