const mongoose = require('mongoose')

const todoSchema = new mongoose.Schema({
    text: String,
    createdBy: String,
    email: String,
    isMarked: {
        type: Number,
        default: 0
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    img: String
})

const Todo = mongoose.model('Todo', todoSchema)

module.exports = Todo