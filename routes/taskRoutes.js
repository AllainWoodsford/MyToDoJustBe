const express = require('express');
const router = express.Router();
const { getList, createTask, deleteTask } = require('../controllers/taskController.js');
const { translateText } = require('../controllers/translateController.js');
const { verifyToken } = require('../middleware/auth.js');
//Temp Data Creation
const toDoList =  [
    {id: 1, taskName: 'Buy groceries', isDone: false , isTranslated: false},
    {id: 2, taskName: 'Eat food', isDone: false , isTranslated: false},
    {id: 3, taskName: 'Code', isDone: false , isTranslated: false},
];

//Get Routes
router.get('/todolist/:id', verifyToken, getList);

//Post Routes
router.post('/task', verifyToken, createTask);

//Patch Routes
router.patch('/task', verifyToken, translateText);

//Danger Zone
//Delete Routes
router.delete('/task/:id' , verifyToken, deleteTask);

module.exports = router;
