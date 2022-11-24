const {Sequelize} = require('sequelize');
const User = require('/models')

User.sync();

module.exports = new Sequelize(
    'telega_bot_db',
    'root',
    'root',
    {
        host: '94.26.224.100',
        port: '6432',
        dialect: 'postgres'
    }
)
