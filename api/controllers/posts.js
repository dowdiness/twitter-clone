const format = require('util').format
const { Router } = require('express')
const Multer = require('multer')
const dateFormat = require('date-fns/format')

// Imports the Google Cloud client library
const { Storage } = require('@google-cloud/storage')
const Firestore = require('@google-cloud/firestore')

// Instantiate a storage client
const storage = new Storage()
const firestore = new Firestore()

const Post = require('../models/Post')
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

// eslint-disable-next-line require-await
async function asyncMap(array, operation) {
  // eslint-disable-next-line no-return-await
  return Promise.all(array.map(async item => await operation(item)))
}

/* GET all posts. */
router.get('/', function(req, res, next) {
  Post.getAllPosts(firestore, function(err, posts) {
    if (!err) {
      if (posts) {
        asyncMap(posts, async post => {
          const userSnap = await post.userRef.get()
          post.avatarUrl = userSnap.get('avatarUrl')
        }).then(_ => {
          return res.status(200).json(posts)
        })
      } else {
        return res.status(204).json(null)
      }
    } else {
      return res.status(500).send(err)
    }
  })
})

/* Upload image to firestorage and save post to firestore */
router.post('/', multer.single('image'), function(req, res, next) {
  if (!req.user) {
    res.status(403).json('ログインしてからTweetして下さい')
    return
  }
  const userRef = User.getUserRefById(req.user.userId, firestore)
  const initDate = new Date()
  const createTime = dateFormat(initDate, 'yyyy/MM/dd-HH:mm:ss')
  if (req.file) {
    const imageName = createTime + '_' + req.file.originalname
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
        userRef: userRef,
        displayName: req.user.displayName,
        createTime: createTime,
        imageUrl: imageUrl,
        postContent: req.body.postContent
      }
      Post.createPost(this.post, firestore, function(err, createdPost) {
        if (err) {
          console.error(err)
          console.log(createdPost)
          res.status(500).send(err)
        } else {
          res.status(200).send(createdPost)
        }
      })
    })
    blobStream.end(req.file.buffer)
  } else {
    console.log('Post without image')
    this.post = {
      userRef: userRef,
      displayName: req.user.displayName,
      createTime: createTime,
      imageUrl: null,
      postContent: req.body.postContent
    }
    Post.createPost(this.post, firestore, function(err, createdPost) {
      if (err) {
        console.error(err)
        console.log(createdPost)
        res.status(500).send(err)
      } else {
        res.status(200).send(createdPost)
      }
    })
  }
})

/* GET specified id posts. */
router.get('/push', function(req, res, next) {
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
