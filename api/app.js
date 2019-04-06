const express = require('express')
const session = require('express-session')

const logger = require('morgan')
const passport = require('passport')

const bodyParser = require('body-parser')

// Create express instnace
const app = express()

// Express session
app.use(
  session({
    secret: process.env.SECRET || 'secret',
    resave: true,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: 'auto',
      maxage: 1000 * 60 * 30
    }
  })
)

app.use(logger('dev'))

// body-parser initialize
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
// Initialize Passport
app.use(passport.initialize())
app.use(passport.session())

app.use(require('./controllers'))

// Export the server middleware
module.exports = {
  path: '/api',
  handler: app
}
