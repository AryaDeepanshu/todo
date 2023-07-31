const fs = require('fs')

function todoUpdate(id, text, name, img, callback){
    let replaced = ""
    fs.readFile("todo.todo", "utf-8", (error, data) => { 
        if(error){
            callback(error)
        }else{
            try{
                let regex = new RegExp(`{"text":"[^"]+","createdBy":"${name}","isMarked":(true|false),"id":${id},"isDeleted":false,"email":"[^"]+","img":"[^"]+"},`, "g")
                let matches = data.match(regex)
                if(matches.length === 0){
                    console.log('No matches found');
                }else {
                    let result = matches[0].replace(/{"text":"[^"]+","/g, '{"text":"'+text+'","')
                    if(img){
                        result = result.replace(/"img":"[^"]+"/g, '"img":"'+img.filename+'"')
                    }
                    replaced = data.replace(matches[0], result);
                    fs.writeFile('todo.todo', replaced, 'utf-8', function (err) {
                        if(err){
                            callback(err)
                        }
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