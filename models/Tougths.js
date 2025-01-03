const {DataTypes}= require('sequelize')
const db = require('../db/conn')

const User = require('./User')

const Tougth = db.define('Tougth',{
    title:{
        type:DataTypes.STRING,
        allowNull:false
    }
})

Tougth.belongsTo(User)
User.hasMany(Tougth)

module.exports = Tougth