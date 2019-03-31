const { Router } = require('express')
const Joi = require('joi')

const base = require('../lib/airtable')
const hash = require('../lib/hash')

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

router.get('/', function(req, res, next) {
  res.json('From Register')
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
