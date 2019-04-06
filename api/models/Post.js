const Firestore = require('@google-cloud/firestore')
const Joi = require('joi')

const Post = {
  postSchema: Joi.object().keys({
    userId: Joi.string()
      .length(21)
      .required(),
    displayName: Joi.string()
      .min(1)
      .required(),
    createTime: Joi.any().required(),
    imageUrl: Joi.string()
      .allow(null)
      .uri(),
    postContent: Joi.string()
      .min(1)
      .max(140)
      .required()
  }),
  createPost: async function(post, callback) {
    // Assign post to this.post
    this.post = {
      userId: post.userId,
      displayName: post.displayName,
      createTime: post.createTime,
      imageUrl: post.imageUrl,
      postContent: post.postContent
    }
    // Assign callback to this.callback
    this.callback =
      callback ||
      function(err, post) {
        console.error(err)
        console.log(post)
      }
    // Validate post data
    const result = Joi.validate(this.post, this.postSchema)
    if (result.error) {
      this.callback(result.error, this.post)
    } else {
      // Get the post document reference and snapshot.
      const firestore = new Firestore()
      const postsColRef = firestore.collection('posts')
      // Create a new post document.
      const postDocRef = await postsColRef.add(this.post).catch(err => {
        console.log(err)
      })
      this.post.postId = postDocRef.id
      console.log('New post is created at: ' + this.post.createTime)
      this.callback(result.error, this.post)
    }
  },
  getAllPosts: async function(callback) {
    // Assign callback to this.callback
    this.callback =
      callback ||
      function(err, post) {
        console.error(err)
        console.log(post)
      }
    // Get the post document reference and snapshot.
    const firestore = new Firestore()
    const postsColRef = firestore.collection('posts')
    const colSnapshot = await postsColRef
      .orderBy('createTime', 'desc')
      .get()
      .catch(err => {
        this.callback(err, null)
      })
    const posts = []
    colSnapshot.forEach(docSnapshot => {
      posts.push(docSnapshot.data())
    })
    this.callback(null, posts)
  }
}

module.exports = Post

/*
const test = {
  userId: '108089674324201517244',
  displayName: 'koji',
  imageUrl: 'https://tailwindcss.com/img/jonathan.jpg',
  postContent: 'postPostContent'
}

Post.createPost(test)
*/
