const { Router } = require('express')
const base = require('../lib/airtable')

const router = Router()

/* GET users listing. */
router.get('/', (req, res, next) => {
  const users = []
  base('Users')
    .select({
      // Selecting the first 3 records in Grid view:
      maxRecords: 10,
      view: 'Grid view'
    })
    .eachPage(
      function page(records, fetchNextPage) {
        // This function (`page`) will get called for each page of records.
        records.forEach((record, index) => {
          users.push({ name: record.get('userName'), id: record.id })
          console.log('Retrieved', users[index])
        })
        // To fetch the next page of records, call `fetchNextPage`.
        // If there are more records, `page` will get called again.
        // If there are no more records, `done` will get called.
        fetchNextPage()
      },
      function done(err) {
        if (!err) {
          res.json(users)
        } else {
          console.error(err)
        }
      }
    )
})

/* GET user by ID. */
router.get('/:id', function(req, res, next) {
  base('Users').find(req.params.id, function(err, record) {
    if (!err && record) {
      console.log(record.fields)
      res.json(record)
    } else {
      console.error(err)
      res.sendStatus(404)
    }
  })
})

router.delete('/:id', (req, res, next) => {
  base('Users').destroy(req.params.id, (err, deletedRecord) => {
    if (!err) {
      console.log('Deleted record', deletedRecord.id)
      res.status(200).json(deletedRecord)
    } else {
      console.error(err)
      res.status(400).send(err)
    }
  })
})

module.exports = router
