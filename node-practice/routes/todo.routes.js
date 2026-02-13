const express = require('express');
const todoController = require('../controllers/todo.controller')

const router = express.Router();

router.get('/todo',todoController.getTodo)

router.post('/todo',todoController.postTodo);

router.post('/todo/:todoId',todoController.deleteTodo);

router.post('/todo/update/:todoId',todoController.updateTodo);

module.exports = router;