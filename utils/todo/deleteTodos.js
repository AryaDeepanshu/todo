const fs = require('fs');

function deleteTodos(req, res){
    if(!req.sessionisLoggedIn)
        res.redirect('/login')
    let id = req.query.id
    let replaced = ""
    fs.readFile("todo.todo", "utf-8", (error, data) => {
        if(error){
            res.status(500).json({error: error})
        }else{
            try{
                todos = JSON.parse(data)
                let filteredTodos = todos.filter(todo  => todo.id == id )
                fs.unlinkSync(`public/assets/uploads/${filteredTodos[0].img}`)
                todos = todos.filter(todo  => todo.id != id )
                fs.writeFile('todo.todo', JSON.stringify(todos), 'utf-8', function (err) {
                    if(err){
                        res.status(500).json({error: err})
                    }
                })
            }catch(error){
                res.status(500).json({error: error})
            }
        }
        res.status(200).send()
    })
}

module.exports = deleteTodos