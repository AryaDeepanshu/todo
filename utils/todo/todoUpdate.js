const fs = require('fs')

function todoUpdate(req, res){
    if (!req.session.isLoggedIn)
        res.redirect('/login')
    let id = req.body.id1
    let img = req.file
    let text = req.body.todoText
    let name = req.session.username
    let replaced = ""
    fs.readFile("todo.todo", "utf-8", (error, data) => { 
        if(error){
            res.status(500).json({error: error})
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
                        res.status(500).json({error: err})
                    }
                })
            }catch(error){
                res.status(500).json({error: error})
            }
        }
        res.redirect('/todo')
    })
}

module.exports = todoUpdate