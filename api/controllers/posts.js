const format = require('util').format
const { Router } = require('express')
const Multer = require('multer')
const dateFormat = require('date-fns/format')

// Imports the Google Cloud client library
const { Storage } = require('@google-cloud/storage')

// Instantiate a storage client
const storage = new Storage()

const Post = require('../models/Post')

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // no larger than 10mb, you can change as needed.
  }
})

// A bucket is a container for objects (files).
const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET)

const router = Router()

/* GET all posts. */
router.get('/', function(req, res, next) {
  Post.getAllPosts(function(err, posts) {
    if (!err) {
      res.status(200).json(posts)
    } else {
      res.status(500).send(err)
    }
  })
})

/* Upload image to firestorage and save post to firestore */
router.post('/', multer.single('image'), function(req, res, next) {
  if (!req.user) {
    res.status(403).json('ログインしてからTweetして下さい')
    return
  }
  const createTime = new Date()
  if (req.file) {
    const dateName = dateFormat(createTime, 'YYMMDDHHmmss')
    const imageName = dateName + '_' + req.file.originalname
    // Create a new blob in the bucket and upload the file data.
    const blob = bucket.file(imageName)
    const blobStream = blob.createWriteStream()
    blobStream.on('error', err => {
      next(err)
    })
    blobStream.on('finish', () => {
      // The public URL can be used to directly access the file via HTTP.
      const imageUrl = format(
        `https://storage.googleapis.com/${bucket.name}/${blob.name}`
      )
      this.post = {
        userId: req.user.userId,
        displayName: req.user.displayName,
        createTime: createTime,
        imageUrl: imageUrl,
        postContent: req.body.postContent
      }
      Post.createPost(this.post, function(err, record) {
        if (err) {
          console.error(err)
          console.log(record)
          res.status(500).send(err)
        } else {
          res.status(200).send(record)
        }
      })
    })
    blobStream.end(req.file.buffer)
  } else {
    console.log('Tweet without image')
    this.post = {
      userId: req.user.userId,
      displayName: req.user.displayName,
      createTime: createTime,
      imageUrl: null,
      postContent: req.body.postContent
    }
    Post.createPost(this.post, function(err, record) {
      if (err) {
        console.error(err)
        console.log(record)
        res.status(500).send(err)
      } else {
        res.status(200).send(record)
      }
    })
  }
})

/* GET specified id posts. */
router.get('/:id', function(req, res, next) {
  res.status(200).json({ message: 'hello' })
})

/* Delete specified id posts. */
router.delete('/:id', function(req, res, next) {
  res.status(200).json({ message: 'hello' })
})

/* Update specified id posts. 
router.update('/', function(req, res, next) {
  res.status(200).json({ message: 'hello' })
})
*/

module.exports = router
