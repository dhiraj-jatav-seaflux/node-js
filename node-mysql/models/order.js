const Sequelize = require('sequelize')

const sequelize = require('../util/database')

const Order = sequelize.define('order',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    quantity:{
        type:Sequelize.INTEGER
    }
});

module.exports =  Order;