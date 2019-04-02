const express = require('express')
const session = require('express-session')

const logger = require('morgan')
const passport = require('passport')

const bodyParser = require('body-parser')

// Require API routes
// const routes = require('./routes/index')
const users = require('./routes/users')
const auth = require('./routes/auth')
const tweets = require('./routes/tweets')

// Create express instnace
const app = express()

/*
async function quickstart(
  bucketName = 'sns-images' // The name for the new bucket
) {
  // Imports the Google Cloud client library
  const { Storage } = require('@google-cloud/storage')

  // Creates a client
  const storage = new Storage()

  // Creates the new bucket
  await storage
    .bucket(bucketName)
    .upload('/Users/Koji/Documents/Nuxt/twitter_clone/testLogo.png', {
      gzip: true,
      destination: 'tweetImages/image.png',
      metadata: {
        // Enable long-lived HTTP caching headers
        // Use only if the contents of the file will never change
        // (If the contents will change, use cacheControl: 'no-cache')
        cacheControl: 'public, max-age=31536000'
      }
    })
  console.log(`Upload to ${bucketName} successed.`)
}

quickstart()
*/

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

// Import API Routes
app.use('/users', users)
app.use('/auth', auth)
app.use('/tweets', tweets)

// Export the server middleware
module.exports = {
  path: '/api',
  handler: app
}
