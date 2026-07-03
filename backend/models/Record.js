const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 


const Record = sequelize.define('Record', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    category: {
        type: DataTypes.ENUM('Food', 'Groceries','Transport', 'Shopping', 'Health', 'Bill', 'Accommodation', 'Entertainment', 'Investment','Others'),
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    date: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('Income', 'Individual Expense', 'Shared Expense'),
        allowNull: false
    },
    isSettled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },

    payerId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    
    creatorId: {
        type: DataTypes.UUID,
        allowNull: false
    }
});

module.exports = Record;