const {Sequelize} = require('sequelize');

module.exports = new Sequelize(
    'nivent_bot',
    'postgres1',
    'postgres1',
    {
        host: 'localhost',
        port: '5432',
        dialect: 'postgres',
        logging: false
    }
)
