const fs = require("fs")

function saveTodo(req, res){
    if(!req.session.isLoggedIn){
        res.redirect('/login')
        return
    }
    d = new Date().getTime()
    let todo = {text: req.body.todoText, createdBy : req.session.username, isMarked: false, id: d, isDeleted: false, email: req.session.email, img: req.file.filename}
    let todos = []
    fs.readFile("todo.todo", "utf-8", (error, data) => {
        if(error){
            res.status(500).json({error: error})
        }else{
            try{
                if(data){
                    todos = JSON.parse(data)
                }
                todos.push(todo)
                let stream = fs.createWriteStream("todo.todo", {flags: 'w'})
                stream.write(JSON.stringify(todos))
                stream.end()
                res.redirect('/todo')
                
            }catch(error){
                res.status(500).json({error: error})
            }
        }
    })
}

module.exports = saveTodo