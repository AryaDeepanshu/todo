const fs = require('fs');
const express = require('express');
const app = express();
const port = 3000;

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

app.post('/todo', (req, res) => {
    const todo = req.body
    saveTodo(todo, (error) => {
        if(error){
            console.log(error)
            res.status(500)
            
            res.json({error: error}).send()
        }else{
            res.status(200).send()
        }
    })
})

function saveTodo(todo, callback){
   let stream = fs.createWriteStream("todo.todo", {flags: 'a'})
   stream.write(JSON.stringify(todo) + "\n")
   stream.end()
    callback()
}

app.listen(port,()=>{
    console.log("Server is running on port 3000")
})