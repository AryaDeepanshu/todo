const fs = require('fs')
const TodoModel = require('../../models/Todo')

function deleteTodos(req, res){
    if(!req.sessionisLoggedIn)
        res.redirect('/login')
    let id = req.query.id
    TodoModel.findOne({_id: id}).then((todo)=>{
        link = todo.img
        fs.unlinkSync(`public/assets/uploads/${link}`)
    }).then(()=>{
        TodoModel.findOneAndDelete({_id: id}).then(()=>{
            res.status(200).send()
        }).catch((error)=>{
            res.status(500).json({error: error})
        })
    })
}

module.exports = deleteTodos