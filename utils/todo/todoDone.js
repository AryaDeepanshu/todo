const TodoModel = require('../../models/Todo.js')

function todoDone(req, res){
    if (!req.session.isLoggedIn)
        res.redirect('/login')
    let id = req.query.id
    TodoModel.findOneAndUpdate({_id: id}, { $bit: { isMarked: { xor: 1 } } }).then(()=>{
        res.status(200).send()
    }).catch((error)=>{
        res.status(500).json({error: error})
    })
}

module.exports = todoDone