const { fileLoader } = require('ejs')
const fs = require('fs')

function todoUpdate(id, text, name, img, callback){
    let replaced = ""
    fs.readFile("todo.todo", "utf-8", (error, data) => { 
        if(error){
            callback(error)
        }else{
            try{
                todos = JSON.parse(data)
                let filteredTodos = todos.filter(todo  => todo.createdBy === name && todo.id == id )
                let newTodo = Object.assign({}, filteredTodos[0])
                newTodo.text = text
                newTodo.img = (img) ? img.filename : newTodo.img
                replaced = data.replace(JSON.stringify(filteredTodos[0]), JSON.stringify(newTodo))
                fs.writeFile('todo.todo', replaced, 'utf-8', function (err) {
                    if(err){
                        callback(err)
                    }
                })
            }catch(error){
                callback(error)
            }
        }
        callback(null)
    })
}

module.exports = todoUpdate