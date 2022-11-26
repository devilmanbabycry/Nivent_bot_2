const {Sequelize} = require('sequelize');

module.exports = new Sequelize(
    'nivent_bot',
    'root',
    'root',
    {
        host: '134.0.112.174',
        dialect: 'postgres',
        logging: false
    }
)
