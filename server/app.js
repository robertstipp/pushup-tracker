const express = require('express')
const authRoutes = require('./routes/authRoutes')

const mongoSanitize = require('express-mongo-sanitize')

const app = express()


// Data sanitization against NoSQL query injection
app.use(mongoSanitize())

// Handle json
app.use(express.json())



app.get('/', (req,res)=> {
  res.send('Hello From the Pushup Tracker')
})


app.use('/api/v1/auth', authRoutes)

module.exports = app