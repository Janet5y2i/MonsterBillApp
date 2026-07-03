// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
    id: { 
        type: DataTypes.UUID, 
        defaultValue: DataTypes.UUIDV4, 
        primaryKey: true 
    },
    username: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        unique: false 
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: { 
        type: DataTypes.STRING, 
        allowNull: false 
    }
}, {
    hooks: {
        beforeCreate: async (user) => {
            if (user.password) {
                const saltRounds = 10;
                user.password = await bcrypt.hash(user.password, saltRounds);
            }
        },
        beforeUpdate: async (user) => {
            if (user.changed('password')) {
                const saltRounds = 10;
                user.password = await bcrypt.hash(user.password, saltRounds);
            }
        }
    }
});

User.prototype.validPassword = async function(password){
    return await bcrypt.compare(password, this.password);
}

module.exports = User;