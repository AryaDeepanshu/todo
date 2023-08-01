const fs = require('fs')

function todoDone(req, res){
    if (!req.session.isLoggedIn)
        res.redirect('/login')
    let id = req.query.id
    replaced = ""
    fs.readFile("todo.todo", "utf-8", (error, data) => {
        if(error){
            res.status(500).json({error: error})
        }else{
            try{
                let findString =""
                let result = ""
                if(data.includes('"isMarked":false,"id":'+id)){
                    findString = '"isMarked":false,"id":'+id
                    result =  '"isMarked":true,"id":'+id
                }else{
                    findString = '"isMarked":true,"id":'+id
                    result = '"isMarked":false,"id":'+id
                } 
                const replaced = data.replace(findString, result);

                fs.writeFile('todo.todo', replaced, 'utf-8', function (err) {
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

module.exports = todoDone