const TodoModel = require('../../models/Todo.js')

function saveTodo(req, res){
    if(!req.session.isLoggedIn){
        res.redirect('/login')
        return
    }
    d = new Date().getTime()
    let todo = {text: req.body.todoText, createdBy : req.session.username, email: req.session.email, isMarked: false, isDeleted: false,  img: req.file.filename}
    TodoModel.create(todo).then((todo)=>{
        res.redirect('/todo')
    }).catch((error)=>{
        res.redirect('/todos?'+error)
    })
}

module.exports = saveTodo