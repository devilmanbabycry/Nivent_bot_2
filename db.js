const {Sequelize} = require('sequelize');

module.exports = new Sequelize(
    'nivent_bot',
    'root',
    'root',
    {
        host: 'localhost',
        port: '3606',
        dialect: 'postgres',
        logging: false
    }
)
