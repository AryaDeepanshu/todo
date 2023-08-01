const fs = require('fs');

// function getTodos(name, email, callback){
//     let filteredTodos = []
//     fs.readFile("todo.todo", "utf-8", (error, data) =>{
//         if(error){
//             callback(error)
//         }else{
//             if(data.length === 0){
//                 data = "[]"
//             }
//             try{
//                 let todos = JSON.parse(data);
//                 filteredTodos = todos.filter(todo  => todo.createdBy === name & todo.email === email )
//             }catch(error){
//                 callback(error, [])
//             }
//         }
//         callback(null, filteredTodos)
//     })
    
// }

function getTodos(req, res){
    if (!req.session.isLoggedIn){
        res.redirect('/login')
        return
    }
    let name = req.session.username
    let email = req.session.email
    let filteredTodos = []
    fs.readFile("todo.todo", "utf-8", (error, data) =>{
        if(error){
            res.status(500).json({error: error})
        }else{
            if(data.length === 0){
                data = "[]"
            }
            try{
                let todos = JSON.parse(data);
                filteredTodos = todos.filter(todo  => todo.createdBy === name & todo.email === email )
                res.status(200)
                res.json(filteredTodos)
            }catch(error){
                res.status(500).json({error: error})
            }
        }
    })
}
module.exports = getTodos