const multer  = require('multer')
const express = require('express')
const mongoose = require('mongoose');
const db = require('./utils/db/db.js')
const session = require('express-session')
const getTodos = require('./utils/todo/getTodos.js')
const saveTodo = require('./utils/todo/saveTodo.js')
const todoDone = require('./utils/todo/todoDone.js')
const todoUpdate = require('./utils/todo/todoUpdate.js')
const logout = require('./utils/authentication/logout.js')
const deleteTodos = require('./utils/todo/deleteTodos.js')
const signUp = require('./utils/authentication/signUp.js')
const loginAUthentication = require('./utils/authentication/loginAuthentication.js')

const port = 8080;
const app = express()
const upload = multer({ dest: 'public/assets/uploads/' })

app.set("view engine", "ejs");
app.set("views", __dirname + "/public");

app.use(express.json())
app.use(upload.single('dp'))
app.use(express.static('public/assets/'))
app.use(express.static('public/assets/uploads/'))
app.use(express.urlencoded({ extended: true }))
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

app.get('/todo', (req, res) => {
    if (!req.session.isLoggedIn){
        res.redirect('/login')
        return
    }
    res.render('app.ejs', {details: req.session.username})
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

app.get('/signup', (req, res) => {
    message = req.session.message
    req.session.message = null
    if(req.session.isLoggedIn){
        res.redirect('/todo')
        return
    }
    res.render('signup', {message: message, details: req.session.username})
})

app.get('/logout', logout)
app.get('/done', todoDone)
app.get('/todos', getTodos)
app.get('/delete', deleteTodos)
app.post('/dp', saveTodo)
app.post('/signup', signUp)
app.post('/update', todoUpdate)
app.post('/login', loginAUthentication)

db.init().then(() => {
    app.listen(port,()=>{
        console.log("Server is running on port 8080")
    })
})