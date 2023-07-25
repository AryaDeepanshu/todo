const express = require('express');
const session = require('express-session')
const getTodos = require('./utils/todo/getTodos.js')
const saveTodo = require('./utils/todo/saveTodo.js')
const todoDone = require('./utils/todo/todoDone.js')
const todoUpdate = require('./utils/todo/todoUpdate.js')
const deleteTodos = require('./utils/todo/deleteTodos.js')
const loginAUthentication = require('./utils/authentication/loginAuthentication.js')
const signUp = require('./utils/authentication/signUp.js')
const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'youwillnotseethisindeployment',
    resave: true,
    saveUninitialized: true,
}))


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})

app.get('/todo', (req, res) => {
    if (!req.session.isLoggedIn){
        res.redirect('/login')
        return
    }
    res.sendFile(__dirname + '/public/main.html')
})


app.get('/css/style.css', (req,res) =>{
    res.sendFile(__dirname + '/public/css/style.css')
})

app.get('/css/index.css', (req,res) =>{
    res.sendFile(__dirname + '/public/css/index.css')
})

app.get('/js/todo.js', (req, res) => {
    res.sendFile(__dirname + "/public/js/todo.js")
})


app.get('/todos', function(req, res){
    if (!req.session.isLoggedIn){
        res.redirect('/login')
        return
    }
    let name = req.session.username
    getTodos(name, function(error, todos){
        if(error){
            res.status(500)
            res.json({ error: error })
        }else{
            res.status(200)
            res.json(todos)
        }
    })
})


app.post('/todo', (req, res) => {
    if (!req.session.isLoggedIn){
        res.redirect('/login')
        return
    }
    const todo = req.body
    saveTodo(todo, (error) => {
        if(error){
            res.status(500)
            res.json({error: error})
        }else{
            res.status(200).send()
        }
    })
})


app.get('/done', function(req, res){
    if (!req.session.isLoggedIn){
        res.redirect('/login')
        return
    }
    let id = req.query.id
    todoDone(id, function(error){
        if(error){
            res.status(500)
            res.json({ error: error })
        }else{
            res.status(200).send()
        }
    })
})


app.get('/update', function(req, res){
    if (!req.session.isLoggedIn){
        res.redirect('/login')
        return
    }
    let id = req.query.id
    let text = req.query.text
    let name = req.query.name
    todoUpdate(id, text, name, function(error){
        if(error){
            res.status(500)
            res.json({ error: error })
        }else{
            res.status(200).send()
        }
    })
})


app.get('/delete', function(req, res){
    if (!req.session.isLoggedIn){
        res.redirect('/login')
        return
    }
    let id = req.query.id
    deleteTodos(id, function(error){
        if(error){
            res.status(500)
            res.json({error: error})
        }else{
            res.status(200).send()
        }
    })
})

app.get('/login', (req, res) => {
    if(req.session.isLoggedIn){
        res.redirect('/todo')
        return
    }
    res.sendFile(__dirname + '/public/login.html')
})

app.get('/logout', (req, res) => {
    req.session.destroy(function (err) {
        if (err) {
            console.error(err);
        } else {
            res.redirect('/login')
        }
    });
    
})

app.get('/signup', (req, res) => {
    if(req.session.isLoggedIn){
        res.redirect('/todo')
        return
    }
    res.sendFile(__dirname + '/public/signup.html')
})

app.post('/login', (req, res) => {

    let username = req.body.username
    let password = req.body.password
    loginAUthentication(username, password, (error)=>{
        if(error){
            console.log(error)
            res.redirect('/login?error=wrong+credentials')
        }else{
            req.session.username = username
            req.session.isLoggedIn = true
            res.status(200).redirect('/todo?name='+username)
        }
    })
})

app.post('/signup', (req, res) => {
    let username = req.body.name
    let password = req.body.password
    let email = req.body.email
    signUp(username, password, email, (error)=>{
        if(error){
            res.redirect('/signup?error=email+already+exists')
        }else{
            res.status(200).redirect('/login')
        }
    })
})


app.listen(port,()=>{
    console.log("Server is running on port 8080")
})