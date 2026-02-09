const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Product = sequelize.define('product',{
  id:{
    type:Sequelize.INTEGER,
    primaryKey:true,
    allowNull:false,
    autoIncrement:true
  },
  title:{
    type:Sequelize.STRING,
    allowNull:false
  },
  description:{
    type: Sequelize.TEXT,
    allowNull:false
  },
  imageUrl:{
    type:Sequelize.STRING,
    allowNull:false
  },
  price:{
    type:Sequelize.DOUBLE,
    allowNull:false
  }
})

module.exports = Product;