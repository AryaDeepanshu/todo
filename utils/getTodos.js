const fs = require('fs');

function getTodos(name,callback){
    let filteredTodos = []
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
                filteredTodos = todos.filter(todo  => todo.createdBy === name );
            }catch(error){
                callback(error, [])
            }
        }
        callback(null, filteredTodos)
    })
    
}

module.exports = getTodos