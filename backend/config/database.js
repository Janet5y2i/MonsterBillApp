const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false //do not print sql
});


const Connection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connect Successfully');
    } catch (error) {
        console.error('Fail to connect to the server：', error.message);
    }
};

Connection();

module.exports = sequelize;