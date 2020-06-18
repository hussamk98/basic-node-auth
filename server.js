
const path = require('path');
const express = require('express')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const errorHandler = require('./middleware/error')
const connectDB = require('./config/db')
const app = express()

//load env variables
dotenv.config({ path: 'config/config.env' })

//connect DB
connectDB()

//middlewares
app.use(express.json())
app.use(cookieParser())

//load routes
const auth = require('./routes/auth')
const profile = require('./routes/profile')

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//mount routes
app.use('/api/user/', auth)
app.use('/api/user/me', profile)
app.use(errorHandler)

const server = app.listen(process.env.PORT || 5000, (err) => {
    if (err) console.log(err)
    else console.log(`Server listening at port ${process.env.PORT || 5000}`)
})
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`)
    //close server & exit process
    server.close(() => process.exit(1))
})