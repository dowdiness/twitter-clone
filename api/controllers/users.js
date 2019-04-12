const format = require('util').format
const { Router } = require('express')
const Multer = require('multer')
// const dateFormat = require('date-fns/format')

// Imports the Google Cloud client library
const { Storage } = require('@google-cloud/storage')
const Firestore = require('@google-cloud/firestore')

// Instantiate a storage client
const storage = new Storage()
const firestore = new Firestore()

const User = require('../models/User')

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // no larger than 10mb, you can change as needed.
  }
})

// A bucket is a container for objects (files).
const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET)

const router = Router()

/* GET user by ID. */
router.post('/', multer.single('image'), function(req, res, next) {
  if (!req.user) {
    res.status(403).json('Please login before update profile')
    return
  }
  if (req.file) {
    const blob = bucket.file(req.file.originalname)
    const blobStream = blob.createWriteStream()
    blobStream.on('error', err => {
      console.log('Error on writing image to clud storage')
      next(err)
    })
    blobStream.on('finish', () => {
      // The public URL can be used to directly access the file via HTTP.
      const avatarUrl = format(
        `https://storage.googleapis.com/${bucket.name}/${blob.name}`
      )
      this.user = {
        userId: req.body.userId,
        displayName: req.body.displayName,
        avatarUrl: avatarUrl
      }
      User.updateUser(this.user, firestore, function(err, createdUser) {
        if (err) {
          console.error(err)
          console.log(createdUser)
          res.res.status(500).send(err)
        } else {
          req.login(createdUser, function(err) {
            if (err) return next(err)
            console.log('After relogin: ' + JSON.stringify(req.user))
            return res.status(200).json(req.user)
          })
        }
      })
    })
    blobStream.end(req.file.buffer)
  } else {
    this.user = {
      userId: req.body.userId,
      displayName: req.body.displayName,
      avatarUrl: req.user.avatarUrl
    }
    User.updateUser(this.user, firestore, function(err, createdUser) {
      if (err) {
        console.error(err)
        console.log(createdUser)
        res.res.status(500).send(err)
      } else {
        req.login(createdUser, function(err) {
          if (err) return next(err)
          console.log('After relogin: ' + JSON.stringify(req.user))
          return res.status(200).json(req.user)
        })
      }
    })
  }
})

router.delete('/:id', (req, res, next) => {})

module.exports = router
