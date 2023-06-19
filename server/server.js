const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config({path: './config.env'})
const app = require('./app')

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
)

mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
    .then(() => {
      console.log('DB connection successful! 🤟')
    }
      )
    .catch(err=>{
      console.log('Connect to MongoDB failed: ', err.message)
    })



const port = process.env.PORT || 8080
const server = app.listen(port, () => {
  console.log(`Pushup-Tracker listening on ${port}`)
})