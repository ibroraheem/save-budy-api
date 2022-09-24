const mongoose = require('mongoose')

require('dotenv').config()

const connectDB = async () => {
    mongoose.connect(process.env.MONGO,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    console.log('MongoDB connected')
}

module.exports = connectDB