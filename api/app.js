const express = require('express')
const session = require('express-session')

const logger = require('morgan')

const bodyParser = require('body-parser')
const passport = require('passport')
const { Strategy } = require('passport-local')

// Require API routes
// const routes = require('./routes/index')
const users = require('./routes/users')
const register = require('./routes/register')
const tweets = require('./routes/tweets')

// Create express instnace
const app = express()

// Mongodb setup
/*
mongoose.connect('mongodb://localhost/test')
mongoose.Promise = global.Promise
mongoose.connection.on('error', err => {
  console.log('We have an error with the database: ' + err)
})
*/

// Express session
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxage: 1000 * 60 * 30
    }
  })
)

app.use(logger('dev'))

// catch 404 and forward to error handler
/*
app.use(function(req, res, next) {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})
*/

// body-parser initialize
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
// Initialize Passport
// app.use(passport.initialize())
// app.use(passport.session())

// Import API Routes
app.use('/users', users)
app.use('/register', register)
app.use('/tweets', tweets)

// Export the server middleware
module.exports = {
  path: '/api',
  handler: app
}
