const sequelize = require('./db');
const {DataType, DataTypes} = require('sequelize')

const Event = sequelize.define('event', {
    id: {type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true},
    chatId: {type: DataTypes.STRING, unique: true},
    name: {type: DataTypes.STRING},
    info: {type: DataTypes.STRING},
    date: {type: DataTypes.DATEONLY},
    time: {type: DataTypes.TIME},
    address: {type: DataTypes.STRING},
    subject: {type: DataTypes.STRING},
})