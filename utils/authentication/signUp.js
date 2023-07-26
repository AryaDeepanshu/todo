const fs = require('fs')

function signUp(username, password, email, callback){
    fs.readFile('users.data', "utf-8",  (error, data) =>{
        users = JSON.parse(data)
        const filteredUser = users.filter(function(user){
            return user.email === email
        })
        if(filteredUser.length != 0){
            callback("Account already exists")
            return
        }
        users.push({username: username, password: password, email: email})
        fs.writeFile('users.data', JSON.stringify(users), (error) =>{
            if(error){
                callback(error)
                return
            }
            callback()
        })
    })
}

module.exports = signUp