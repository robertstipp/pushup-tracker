const express = require('express')
const authRoutes = require('./routes/authRoutes')

const mongoSanitize = require('express-mongo-sanitize')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const app = express()


// Data sanitization against NoSQL query injection
app.use(mongoSanitize())

// Handle JSON
app.use(express.json())

// Handle Cookies
app.use(cookieParser())

// Handle Cors
app.use(cors({
  credentials: true,
  origin: 'http://localhost:3000'
}))

app.get('/', (req,res)=> {
  res.send('Hello From the Pushup Tracker')
})


app.use('/api/v1/auth', authRoutes)

module.exports = app