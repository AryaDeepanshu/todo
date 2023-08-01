const fs = require("fs")

function saveTodo(todo, callback){
    let todos =[]
    fs.readFile("todo.todo", "utf-8", (error, data) => {
        if(error){
            callback(error)
        }else{
            try{
                if(data){
                    todos = JSON.parse(data)
                }
                todos.push(todo)
                let stream = fs.createWriteStream("todo.todo", {flags: 'w'})
                stream.write(JSON.stringify(todos))
                stream.end()
                callback(null)
                
            }catch(error){
                callback(error)
            }
        }
        callback(null)
    })
}

module.exports = saveTodo