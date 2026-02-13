const Sequelize = require('sequelize');

const sequelize = new Sequelize('todo','root','2003',{dialect:'mysql',host:'localhost'});

module.exports = sequelize;

