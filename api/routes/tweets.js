const { Router } = require('express')
const Joi = require('joi')

const base = require('../lib/airtable')

const router = Router()

const tweetSchema = Joi.object().keys({
  tweet: Joi.string()
    .min(1)
    .max(120)
    .required(),
  user: Joi.array()
    .items(Joi.string().length(17))
    .length(1)
    .required()
})

/* GET tweets listing. */
router.get('/', function(req, res, next) {
  const tweets = []
  base('Tweets')
    .select({
      // Selecting the first 3 records in Grid view:
      maxRecords: 10,
      view: 'Grid view'
    })
    .eachPage(
      function page(records, fetchNextPage) {
        // This function (`page`) will get called for each page of records.
        records.forEach(function(record, index) {
          tweets.push({ name: record.get('user'), tweet: record.get('tweet') })
          console.log('Retrieved', tweets[index])
        })
        // To fetch the next page of records, call `fetchNextPage`.
        // If there are more records, `page` will get called again.
        // If there are no more records, `done` will get called.
        fetchNextPage()
      },
      function done(err) {
        if (!err) {
          res.json(tweets)
        } else {
          console.error(err)
        }
      }
    )
})

router.post('/', function(req, res, next) {
  const tweet = req.body.tweet
  const user = []
  user.push(req.body.user)
  const tweetObj = {
    tweet: tweet,
    user: user
  }
  const result = Joi.validate(tweetObj, tweetSchema)
  if (!result.error) {
    base('tweets').create(tweetObj, function(err, record) {
      if (!err) {
        console.log(record)
        res.json(record.fields)
      } else {
        console.error(err)
      }
    })
  } else {
    console.error(result.error)
    res.status(422).send(result.error)
  }
})

// router.update('/', function(req, res, next) {})

module.exports = router
