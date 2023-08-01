const fs = require('fs');

function getTodos(name, email, callback){
    let filteredTodos = []
    fs.readFile("todo.todo", "utf-8", (error, data) =>{
        if(error){
            callback(error)
        }else{
            if(data.length === 0){
                data = "[]"
            }
            try{
                let todos = JSON.parse(data);
                filteredTodos = todos.filter(todo  => todo.createdBy === name & todo.email === email )
            }catch(error){
                callback(error, [])
            }
        }
        callback(null, filteredTodos)
    })
    
}

module.exports = getTodos