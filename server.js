const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const connectDB = require('./config/db')
require('dotenv').config()

app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send('Hello World!')
})

connectDB()
app.use('/admin', require('./routes/adminRoutes'))
app.use('/', require('./routes/authRoutes'))

app.listen(process.env.PORT, () => {
    console.log('Server is running on port 3000')
})

