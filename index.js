const express = require('express');
const session = require('express-session')
const multer  = require('multer')
const getTodos = require('./utils/todo/getTodos.js')
const saveTodo = require('./utils/todo/saveTodo.js')
const todoDone = require('./utils/todo/todoDone.js')
const todoUpdate = require('./utils/todo/todoUpdate.js')
const deleteTodos = require('./utils/todo/deleteTodos.js')
const loginAUthentication = require('./utils/authentication/loginAuthentication.js')
const signUp = require('./utils/authentication/signUp.js')
const upload = multer({ dest: 'public/assets/uploads/' })
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
app.use(express.static('public/assets/uploads/'))


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

app.post('/dp', upload.single('dp'), (req, res) => {
    if (!req.session.isLoggedIn){
        res.redirect('/login')
        return
    }
    d = new Date().getTime()
    todo = {text: req.body.todoText, createdBy : req.session.username, isMarked: false, id: d, isDeleted: false, email: req.session.email, img: req.file.filename}
    saveTodo(todo, (error) => {
        if(error){
            console.log(error)
        }
    }) 
    res.redirect('/todo')
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


app.post('/update', upload.single('dp'), function(req, res){
    if (!req.session.isLoggedIn){
        res.redirect('/login')
        return
    }
    let id = req.body.id1
    console.log(id)
    let img = req.file
    let text = req.body.todoText
    let name = req.session.username
    todoUpdate(id, text, name, img, function(error){
        if(error){
            res.status(500)
            res.json({ error: error })
        }else{
            res.redirect('/todo')
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
    message = req.session.message
    req.session.message = null
    if(req.session.isLoggedIn){
        res.redirect('/todo')
        return
    }
    res.render('login', {message: message , details: req.session.username})
    
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
    message = req.session.message
    req.session.message = null
    if(req.session.isLoggedIn){
        res.redirect('/todo')
        return
    }
    res.render('signup', {message: message, details: req.session.username})
})

app.post('/login', (req, res) => {
    let email = req.body.email
    let password = req.body.password
    loginAUthentication(email, password, (error, user)=>{
        if(error){
            req.session.message = error
            res.redirect('/login')
        }else{
            req.session.username = user.username
            req.session.isLoggedIn = true
            req.session.email = user.email
            res.redirect('/todo?name='+req.session.username)
        }
    })
})

app.post('/signup', (req, res) => {
    let username = req.body.name
    let password = req.body.password
    let email = req.body.email
    signUp(username, password, email, (error)=>{
        if(error){
            req.session.message = error
            res.redirect('/signup')
        }else{
            req.session.message = "login with account created"
            res.redirect('/login')
        }
    })
})


app.listen(port,()=>{
    console.log("Server is running on port 8080")
})