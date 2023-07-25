const fs = require('fs')

function loginAUthentication(username, password, callback){
    fs.readFile('users.data', "utf-8",  (error, data) =>{
        if(error){
            callback(error)
        }
        const users = JSON.parse(data)
        const filteredUser = users.filter(function(user){
            return user.username === username && user.password === password 
        })
        if(filteredUser.length != 1){
            callback("Wrong credentials")
            return
        }
        callback()
    })
}

module.exports = loginAUthentication