require('dotenv').config()
const mongoose = require('mongoose')

module.exports.init = async function(){
    await mongoose.connect(process.env.MONGO_URL)
    console.log('Connected to database')
}