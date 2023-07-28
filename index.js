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
app.set("view engine", "ejs");
app.set("views", __dirname + "/public");
app.use(express.urlencoded({ extended: true }));
app.use(function(req, res, next) {
    if (!req.user)
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next();
})
app.use(session({
    secret: 'youwillnotseethisindeployment',
    resave: true,
    saveUninitialized: true,
}))


app.get('/', (req, res) => {
    res.render('index', {details: req.session.username})
})

// define static file
app.use(express.static('public/assets/'))


app.get('/todo', function(req, res){
    if (!req.session.isLoggedIn){
        res.redirect('/login')
        return
    }
    let name = req.session.username
    let email = req.session.email
    getTodos(name, email, function(error, todos){
        if(error){
            res.status(500)
            res.json({ error: error })
        }else{
            res.status(200)
            res.render('app.ejs', {todos: todos, details: req.session.username})
        }
    })
})


app.post('/todo', (req, res) => {
    if (!req.session.isLoggedIn){
        res.redirect('/login')
        return
    }
    const todo = req.body
    const email = req.session.email
    todo.email = email
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
    res.render('login', {error: '', details: req.session.username})
})

app.get('/logout', (req, res) => {
    req.session.destroy(function (err) {
        if (err) {
            console.error(err);
        } else {
            res.render('login', {error: '', details: null})
        }
    });
    
})

app.get('/signup', (req, res) => {
    if(req.session.isLoggedIn){
        res.redirect('/todo')
        return
    }
    res.render('signup', {error: '', details: req.session.username})
})

app.post('/login', (req, res) => {
    let email = req.body.email
    let password = req.body.password
    loginAUthentication(email, password, (error, user)=>{
        if(error){
            res.render('login', {error: "Wrong credentials", details: req.session.username})
        }else{
            req.session.username = user.username
            req.session.isLoggedIn = true
            req.session.email = user.email
            res.status(200).redirect('/todo?name='+req.session.username)
        }
    })
})

app.post('/signup', (req, res) => {
    let username = req.body.name
    let password = req.body.password
    let email = req.body.email
    signUp(username, password, email, (error)=>{
        if(error){
            res.render('signup', {error: error, details: null})
        }else{
            res.status(200).render('login', {error: 'login with account you created', details: null})
        }
    })
})


app.listen(port,()=>{
    console.log("Server is running on port 8080")
})