const fs = require('fs');
const express = require('express');
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


app.post('/todo', (req, res) => {
    const todo = req.body
    saveTodo(todo, (error) => {
        if(error){
            res.status(500)
            res.json({error: error}).send()
        }else{
            res.status(200).send()
        }
    })
})

function deleteTodos(id,callback){
    replaced = ""
    fs.readFile("todo.todo", "utf-8", (error, data) => {
        if(error){
            callback(error)
        }else{
            try{
                // let findString = '"id":'+id+',"isDeleted":false'
                // let result = '"id":'+id+',"isDeleted":true' 
                // const replaced = data.replace(findString, result);

                // fs.writeFile('todo.todo', replaced, 'utf-8', function (err) {
                //     console.log(err)
                // })
                let regex = new RegExp(`{"text":"[^"]+","createdBy":"[^"]+","isMarked":(true|false),"id":${id},"isDeleted":false},`, "g")
                let matches = data.match(regex)
                if(matches.length === 0){
                    console.log('No matches found');
                }else {
                    let result = ""
                    
                    replaced = data.replace(matches[0], result);
                    fs.writeFile('todo.todo', replaced, 'utf-8', function (err) {
                        console.log(err)
                    })
                }
            }catch(error){
                callback(error)
            }
        }
    })
    callback(null)
}

function todoDone(id, callback){
    replaced = ""
    fs.readFile("todo.todo", "utf-8", (error, data) => {
        if(error){
            callback(error)
        }else{
            try{
                let findString =""
                let result = ""
                if(data.includes('"isMarked":false,"id":'+id)){
                     findString = '"isMarked":false,"id":'+id
                     result =  '"isMarked":true,"id":'+id
                }else{
                     findString = '"isMarked":true,"id":'+id
                     result = '"isMarked":false,"id":'+id
                } 
                const replaced = data.replace(findString, result);

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

function todoUpdate(id, text, name, callback){
    let replaced = ""
    fs.readFile("todo.todo", "utf-8", (error, data) => { 
        if(error){
            callback(error)
        }else{
            try{
                let regex = new RegExp(`{"text":"[^"]+","createdBy":"${name}","isMarked":(true|false),"id":${id}`, "g")
                let matches = data.match(regex)
                if(matches.length === 0){
                    console.log('No matches found');
                }else {
                    let result = matches[0].replace(/{"text":"[^"]+","/g, '{"text":"'+text+'","')
                    
                    replaced = data.replace(matches[0], result);
                    fs.writeFile('todo.todo', replaced, 'utf-8', function (err) {
                        console.log(err)
                    })
                
                }
            }catch(error){
                callback(error, [])
            }
        }
    })
    callback(null, [])
}

function saveTodo(todo, callback){
    let stream = fs.createWriteStream("todo.todo", {flags: 'a'})
    stream.write(JSON.stringify(todo) + ",")
    stream.end()
    callback()
}

function getTodos(name,callback){
    fs.readFile("todo.todo", "utf-8", (error, data) =>{
        if(error){
            callback(error)
        }else{
            if(data.length === 0){
                data = ""
            }
            try{
                if(data[data.length - 1] === ",")
                    data = data.substring(0, data.length - 1);
                todoString = '['+ data +']'
                let todos = JSON.parse(todoString);
                const filteredTodos = todos.filter(todo  => todo.createdBy === name );
                // const filteredTodos = todos.filter(function(todo){
                //     return todo.createdBy === name  todo.isDeleted !="true" 
                // })
                callback(null, filteredTodos)
            }catch(error){
                callback(null, [])
            }
        }
    })
}

app.listen(port,()=>{
    console.log("Server is running on port 8080")
})