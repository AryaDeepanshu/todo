const fs = require('fs')

function todoUpdate(id, text, name, callback){
    let replaced = ""
    fs.readFile("todo.todo", "utf-8", (error, data) => { 
        if(error){
            callback(error)
        }else{
            try{
                let regex = new RegExp(`{"text":"[^"]+","createdBy":"${name}","isMarked":(true|false),"id":${id}`, "g")
                let matches = data.match(regex)
                if(matches.length === 0){
                    console.log('No matches found');
                }else {
                    let result = matches[0].replace(/{"text":"[^"]+","/g, '{"text":"'+text+'","')
                    replaced = data.replace(matches[0], result);
                    fs.writeFile('todo.todo', replaced, 'utf-8', function (err) {
                        console.log(err)
                    })
                }
            }catch(error){
                callback(error)
            }
        }
        callback(null)
    })
}

module.exports = todoUpdate