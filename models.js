const sequelize = require('./db');
const {DataTypes} = require('sequelize')

const Event = sequelize.define('event', {
    id: {type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true},
    name: {type: DataTypes.STRING},
    info: {type: DataTypes.STRING},
    date_begin: {type: DataTypes.STRING},
    time_begin: {type: DataTypes.STRING},
    date_end: {type: DataTypes.STRING},
    time_end: {type: DataTypes.STRING},
    link: {type: DataTypes.STRING},
    link_tg: {type: DataTypes.STRING},
    address: {type: DataTypes.STRING},
    subject: {type: DataTypes.STRING},
    price: {type: DataTypes.STRING},
}, {
    timestamps: false,
    createdAt: false,
    tableName: 'event',
})

module.exports = Event;