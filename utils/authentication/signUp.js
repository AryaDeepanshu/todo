const UserModel = require('../../models/User.js')

function signUp(req, res){
    const user = {
        username: req.body.name,
        email: req.body.email,
        password: req.body.password
    }
    UserModel.create(user).then( (user)=>{
        req.session.message = "login with account created"
        res.status(200).redirect('/login')
    }).catch( (error)=>{
        req.session.message = error.message
        res.status(500).redirect('/signup')
        return
    })
}

module.exports = signUp