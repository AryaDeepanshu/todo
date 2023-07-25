const fs = require("fs")

function saveTodo(todo, callback){
    try{
        let stream = fs.createWriteStream("todo.todo", {flags: 'a'})
        stream.write(JSON.stringify(todo) + ",")
        stream.end()
        callback(null)
    }catch(error){
        callback(error)
    }
}

module.exports = saveTodo