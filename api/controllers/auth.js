const { Router } = require('express')

const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const Firestore = require('@google-cloud/firestore')

const User = require('../models/User')

const router = Router()

const firestore = new Firestore()

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}/callback`
    },
    (accessToken, refreshToken, profile, done) => {
      process.nextTick(() => {
        User.findOrCreate(profile, firestore, (err, user) => {
          if (err) {
            return done(err)
          }
          return done(null, user)
        })
      })
    }
  )
)

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((obj, done) => {
  done(null, obj)
})

router.get('/', function(req, res, next) {
  res.json('From Auth')
})

router.get(
  '/login',
  passport.authenticate('google', {
    scope: ['openid email profile']
  })
)

router.get('/callback', passport.authenticate('google'), (req, res) => {
  res.json({ user: req.user })
})

router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/?logout=true')
})

router.get('/session', (req, res) => {
  res.json({ user: req.user })
})

module.exports = router
