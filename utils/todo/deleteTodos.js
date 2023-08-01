const fs = require('fs');

function deleteTodos(id,callback){
    let replaced = ""
    fs.readFile("todo.todo", "utf-8", (error, data) => {
        if(error){
            callback(error)
        }else{
            try{
                todos = JSON.parse(data)
                let filteredTodos = todos.filter(todo  => todo.id == id )
                fs.unlinkSync(`public/assets/uploads/${filteredTodos[0].img}`)
                todos = todos.filter(todo  => todo.id != id )
                fs.writeFile('todo.todo', JSON.stringify(todos), 'utf-8', function (err) {
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

module.exports = deleteTodos