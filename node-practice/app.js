const express = require('express')
const sequelize = require('./utils/database')
const todoRouter = require('./routes/todo.routes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(todoRouter);

sequelize.sync().then(result=>{
    console.log('Connection successful')
    app.listen(3000);
}).catch(err=>console.log(err));