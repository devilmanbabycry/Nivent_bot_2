const sequelize = require('./db');
const {DataTypes} = require('sequelize')

const Event = sequelize.define('event', {
    id: {type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true},
    name: {type: DataTypes.STRING},
    info: {type: DataTypes.STRING},
    dateBegin: {type: DataTypes.DATEONLY},
    timeBegin: {type: DataTypes.TIME},
    dateEnd: {type: DataTypes.DATEONLY},
    timeEnd: {type: DataTypes.TIME},
    address: {type: DataTypes.STRING},
    subject: {type: DataTypes.STRING},
}, {
    timestamps: false,
    createdAt: false,
    tableName: 'event',
})

module.exports = Event;