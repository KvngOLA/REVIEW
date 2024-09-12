const dotenv = require('dotenv')
dotenv.config()
const mongoose = require('mongoose')



const connectDb = async() => {
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Connected to database successfully')
    }catch(err) {
        console.log(err)
    }
}

module.exports = connectDb