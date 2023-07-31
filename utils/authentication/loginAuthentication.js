const fs = require('fs')

function loginAUthentication(email, password, callback){
    fs.readFile('users.data', "utf-8",  (error, data) =>{
        if(error){
            callback(error, {})
        }
        const users = JSON.parse(data)
        const filteredUser = users.filter(function(user){
            return user.email === email && user.password === password 
        })
        if(filteredUser.length != 1){
            callback("Wrong credentials", {})
            return
        }
        callback(null, {username : filteredUser[0].username, email : filteredUser[0].email})
        
    })
}

module.exports = loginAUthentication