const sequelize = require('./db');
const {DataTypes} = require('sequelize')

const Event = sequelize.define('event', {
    id: {type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true},
    name: {type: DataTypes.STRING},
    info: {type: DataTypes.STRING},
    date_begin: {type: DataTypes.DATEONLY},
    time_begin: {type: DataTypes.TIME},
    date_end: {type: DataTypes.DATEONLY},
    time_end: {type: DataTypes.TIME},
    address: {type: DataTypes.STRING},
    subject: {type: DataTypes.STRING},
}, {
    timestamps: false,
    createdAt: false,
    tableName: 'event',
})

module.exports = Event;