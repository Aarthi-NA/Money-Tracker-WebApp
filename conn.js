const mongoose = require('mongoose')
require('dotenv').config()
const connectDb = () =>{
    mongoose.connect(process.env.MONGO_URI).then(()=>{
        console.log("Database connected")
    }).catch((err)=>{
        console.log(err)
    })
}

module.exports = connectDb