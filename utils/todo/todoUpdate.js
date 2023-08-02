const TodoModel = require('../../models/Todo.js')

function todoUpdate(req, res){
    if (!req.session.isLoggedIn)
        res.redirect('/login')
    let [id, url] = req.body.id1.split("~")
    let oldImg = url.substring(url.lastIndexOf("/") + 1, url.length)
    let newImg = req.file
    let text = req.body.todoText
    let name = req.session.username
    TodoModel.findOneAndUpdate({_id: id}, {text: text, img: (newImg) ? newImg.filename : oldImg}).then(()=>{
        res.redirect('/todo')
    }).catch((error)=>{
        res.status(500).json({error: error})
    })
}

module.exports = todoUpdate