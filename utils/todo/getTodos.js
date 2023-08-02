const TodoModel = require('../../models/Todo.js')

function getTodos(req, res){
    if (!req.session.isLoggedIn){
        res.redirect('/login')
        return
    }
    let name = req.session.username
    let email = req.session.email
    TodoModel.find({createdBy: name, email: email}).then((todos)=>{
        if(todos.length === 0){
            res.status(200)
            res.json([])
        }else{
            res.status(200)
            res.json(todos)
        }  
    })
}
module.exports = getTodos