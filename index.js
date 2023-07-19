const express = require('express');
const app = express();
const port = 3000;
app.use(express.static(__dirname + "/public/"))
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})

app.get('/css/style.css', (req,res) =>{
    res.sendFile(__dirname + 'public/css/style.css')
})

app.get('/js/todo.js', (req, res) => {
    res.sendFile(__dirname + "public/js/todo.js")
})


app.listen(port,()=>{
    console.log("Server is running on port 3000")
})