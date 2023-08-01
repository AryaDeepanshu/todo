const fs = require('fs')

function signUp(req, res){
    let username = req.body.name
    let password = req.body.password
    let email = req.body.email
    fs.readFile('users.data', "utf-8",  (error, data) =>{
        if(error){
            req.session.message = error
            res.status(500).redirect('/signup')
            return
        }
        users = JSON.parse(data)
        const filteredUser = users.filter(function(user){
            return user.email === email
        })
        if(filteredUser.length != 0){
            req.session.message = "Account already exists"
            res.status(200).redirect('/signup')
            return
        }
        users.push({username: username, password: password, email: email})
        fs.writeFile('users.data', JSON.stringify(users), (error) =>{
            if(error){
                req.session.message = error
                res.status(500).redirect('/signup')
                return
            }
            req.session.message = "login with account created"
            res.status(200).redirect('/login')
        })
    })
}

module.exports = signUp