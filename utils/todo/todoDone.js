const fs = require('fs')

function todoDone(id, callback){
    replaced = ""
    fs.readFile("todo.todo", "utf-8", (error, data) => {
        if(error){
            callback(error)
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
                    console.log(err)
                })
            }catch(error){
                callback(error)
            }
        }
        callback(null)
    })
}

module.exports = todoDone