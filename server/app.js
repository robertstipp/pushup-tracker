const express = require('express')
const mongoSanitize = require('express-mongo-sanitize')

const app = express()


// Data sanitization against NoSQL query injection
app.use(mongoSanitize())

app.get('/', (req,res)=> {
  res.send('Hello From the Pushup Tracker')
})

module.exports = app