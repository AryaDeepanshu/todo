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

app.get('/todos', function(req, res){
    let name = req.query.name
    console.log(name)
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

app.get('/delete', function(req, res){
    let id = req.query.id
    console.log(id)
    deleteTodos(id, function(error){
        if(error){
            res.status(500)
            res.json({ error: error })
        }else{
            res.status(200).send()
        }

    })
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
   stream.write(JSON.stringify(todo) + ",")
   stream.end()
    callback()
}

function deleteTodos(id,callback){
    replaced = ""
    fs.readFile("todo.todo", "utf-8", (error, data) => {
        if(error){
            callback(error)
        }else{
            try{
                let findString = '"id":'+id+',"isDeleted":false'
                let result = '"id":'+id+',"isDeleted":true' 
                const replaced = data.replace(findString, result);
                console.log(replaced)
                fs.writeFile('todo.todo', replaced, 'utf-8', function (err) {
                    console.log(err)
                })
            }catch(error){
                callback(error, [])
            }
        }
    })
    callback(null,[])
}


function getTodos(name,callback){
    fs.readFile("todo.todo", "utf-8", (error, data) =>{
        console.log("inside")
        if(error){
            callback(error)
        }else{
            if(data.length === 0){
                data = ""
            }
            try{
                data = data.substring(0, data.length - 1);
                todoString = '['+ data +']'
                let todos = JSON.parse(todoString);
                const filteredTodos = todos.filter(todo  => todo.createdBy === name && (!todo.isDeleted));
                // const filteredTodos = todos.filter(function(todo){
                //     return todo.createdBy === name  todo.isDeleted !="true" 
                // })
                console.log(filteredTodos)
                callback(null, filteredTodos)
            }catch(error){
                callback(null, [])
            }
        }
    })
}

app.listen(port,()=>{
    console.log("Server is running on port 3000")
})