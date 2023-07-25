const fs = require('fs');
const express = require('express');
const getTodos = require('./utils/getTodos.js')
const saveTodo = require('./utils/saveTodo.js')
const todoDone = require('./utils/todoDone.js')
const todoUpdate = require('./utils/todoUpdate.js')
const deleteTodos = require('./utils/deleteTodos.js')

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.static(__dirname + "/public/"))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})


app.get('/css/style.css', (req,res) =>{
    res.sendFile(__dirname + 'public/css/style.css')
})


app.get('/js/todo.js', (req, res) => {
    res.sendFile(__dirname + "public/js/todo.js")
})


app.get('/todos', function(req, res){
    let name = req.query.name
    getTodos(name, function(error, todos){
        if(error){
            res.status(500)
            res.json({ error: error })
        }else{
            res.status(200)
            res.json(todos)
        }
    })
})


app.post('/todo', (req, res) => {
    const todo = req.body
    saveTodo(todo, (error) => {
        if(error){
            res.status(500)
            res.json({error: error})
        }else{
            res.status(200).send()
        }
    })
})


app.get('/done', function(req, res){
    let id = req.query.id
    todoDone(id, function(error){
        if(error){
            res.status(500)
            res.json({ error: error })
        }else{
            res.status(200).send()
        }
    })
})


app.get('/update', function(req, res){
    let id = req.query.id
    let text = req.query.text
    let name = req.query.name
    todoUpdate(id, text, name, function(error){
        if(error){
            res.status(500)
            res.json({ error: error })
        }else{
            res.status(200).send()
        }
    })
})


app.get('/delete', function(req, res){
    let id = req.query.id
    deleteTodos(id, function(error){
        if(error){
            res.status(500)
            res.json({error: error})
        }else{
            res.status(200).send()
        }
    })
})


app.listen(port,()=>{
    console.log("Server is running on port 8080")
})