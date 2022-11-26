const {Sequelize} = require('sequelize');

module.exports = new Sequelize(
    'nivent_bot',
    'root',
    '',
    {
        host: 'localhost',
        port: '5432',
        dialect: 'postgres',
        logging: false
    }
)
