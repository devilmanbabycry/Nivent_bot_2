const {Sequelize} = require('sequelize');

module.exports = new Sequelize(
    'telega_bot_db',
    'root',
    '',
    {
        host: '134.0.112.174',
        dialect: 'postgres',
        logging: false
    }
)
