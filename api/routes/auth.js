const { Router } = require('express')
const Joi = require('joi')

const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy

const base = require('../lib/airtable')
const hash = require('../lib/hash')

const User = require('../models/User')

const router = Router()

const userSchema = Joi.object().keys({
  userName: Joi.string()
    .min(3)
    .max(30)
    .required(),
  password: Joi.string()
    .regex(/^[a-zA-Z0-9]{3,30}$/)
    .required(),
  email: Joi.string()
    .email({ minDomainAtoms: 2 })
    .required()
})

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}/callback`
    },
    (accessToken, refreshToken, profile, done) => {
      process.nextTick(() => {
        User.findOrCreate(profile, (err, user) => {
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
  res.redirect('/')
})

router.get('/session', (req, res) => {
  res.json({ user: req.user })
})

router.post('/', function(req, res, next) {
  const userName = req.body.userName
  const password = req.body.password
  const email = req.body.email

  const result = Joi.validate(
    { userName: userName, password: password, email: email },
    userSchema
  )

  if (!result.error) {
    const hashedPassword = hash(password)
    const userObj = {
      userName: userName,
      hashedPassword: hashedPassword,
      email: email
    }
    base('users').create(userObj, function(_err, record) {
      if (!_err) {
        console.log(record.getId())
        res.json(record.getId())
      } else {
        console.error(_err)
        res.status(500).send(_err)
      }
    })
  } else {
    console.error(result.error)
    res.status(422).send(result.error)
  }
})

module.exports = router
