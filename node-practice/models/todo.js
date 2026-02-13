const sequelize = require('../utils/database');
const Sequelize = require('sequelize');

const Todo = sequelize.define('todo',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        allowNull:false,
        autoIncrement:true
    },
    task_name:{
        type:Sequelize.STRING,
        allowNull:false
    },
    status:{
        type:Sequelize.BOOLEAN,
        allowNull:false,
        defaultValue:false
    }
});

module.exports = Todo;