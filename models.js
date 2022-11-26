const sequelize = require('./db');
const {DataTypes} = require('sequelize')

const Event = sequelize.define('event', {
    id: {type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true},
    name: {type: DataTypes.STRING},
    info: {type: DataTypes.STRING},
    datebegin: {type: DataTypes.DATEONLY},
    timebegin: {type: DataTypes.TIME},
    dateend: {type: DataTypes.DATEONLY},
    timeend: {type: DataTypes.TIME},
    address: {type: DataTypes.STRING},
    subject: {type: DataTypes.STRING},
}, {
    timestamps: false,
    createdAt: false,
    tableName: 'event',
})

module.exports = Event;