const { where } = require('sequelize');
const Todo = require('../models/todo');

exports.getTodo = (req,res,next)=>{
    Todo.findAll().then(todo=>{
        return todo;
    }).then(data=>{
        res.status(200).json({
            message:'Todos fetched successfully',
            todos:data
        })
    }).catch(err=>console.log(err));
}

exports.postTodo = (req,res,next)=>{
    const {taskName} = req.body;
    Todo.create({
        task_name:taskName
    }).then(result=>{
        res.status(201).json({
            message:'Todo created successfully',
            todo:result
        })
    }).catch(err=>console.log(err));
}

exports.deleteTodo = (req,res)=>{
    const {todoId} = req.params;
    Todo.findByPk(todoId).then(todo=>{
        todo.destroy();
        res.status(200).json({
            message:'Todo deleted successfully',
            result:todo
        })
    }).catch(err=>{
        console.log(err);
        res.json({
            message:err.message
        })
    })
}

exports.updateTodo = (req,res,next)=>{
    const{taskName} = req.body;
    const{status} = req.body;
    const{todoId} = req.params;

    Todo.findByPk(todoId).then(todo=>{
        return todo.update({task_name:taskName,status:status})
    }).then(result=>{
        res.status(200).json({
            message:result.message
        })
    }).catch(err=>{
        res.json({
            message:err.message
        })
    })
}