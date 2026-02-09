const Sequelize = require('sequelize');

const sequelize = new Sequelize('node_complete','root','2003',{dialect:'mysql',host:'localhost'});

module.exports = sequelize;