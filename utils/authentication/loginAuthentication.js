const fs = require('fs')

function loginAUthentication(req, res){
    let email = req.body.email
    let password = req.body.password
    fs.readFile('users.data', "utf-8",  (error, data) =>{
        if(error){
            req.session.message = error
            res.status(500).redirect('/login')
            return
        }
        const users = JSON.parse(data)
        const filteredUser = users.filter(function(user){
            return user.email === email && user.password === password 
        })
        if(filteredUser.length != 1){
            req.session.message = "Wrong credentials"
            res.status(200).redirect('/login')
            return
        }
        req.session.username = filteredUser[0].username
        req.session.email = filteredUser[0].email
        req.session.isLoggedIn = true
        res.redirect('/todo?name='+req.session.username)
    })
}

module.exports = loginAUthentication