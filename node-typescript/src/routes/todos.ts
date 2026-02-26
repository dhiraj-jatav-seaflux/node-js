import express from 'express'
import { Todo } from '../models/todo.js';

const router = express.Router();

let todos: Todo[] = [];

type RequestBody = {text:string}
type RequestParams = {todoId:string}

router.get('/',(req,res,next)=>{
    res.status(200).json({todos:todos})
})

router.post('/todo',(req,res,next)=>{
    const body = req.body as RequestBody;

    const newTodo = {
        id:new Date().toISOString(),
        text:body.text
    }
    todos.push(newTodo);

    res.status(201).json({message:'Todo created successfully', todo:newTodo, todos:todos})
})

router.put('/todo/:todoId',(req,res,next)=>{
    const params = req.params as RequestParams
    const body = req.body as RequestBody

    const todoId = params.todoId;

    const todoIndex = todos.findIndex(todo=>todo.id === todoId)

     const updatedTodo = {
        id:todoId,
        text:body.text
    }

    if(todoIndex>=0){
        todos[todoIndex] = updatedTodo
        return res.status(200).json({message:'Updated Todo', todos:todos})
    }
    res.status(404).json({message:'Count not find todo with this id'})
})

router.delete('/todo/:todoId',(req,res,next)=>{
    const params = req.params as RequestParams;
    todos = todos.filter(todo=>todo.id !== params.todoId)
    res.status(200).json({message:'Deleted todo successfully', todos:todos})
})

export default router;