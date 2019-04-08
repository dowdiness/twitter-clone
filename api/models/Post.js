const Joi = require('joi')

const Post = {
  postSchema: Joi.object().keys({
    userRef: Joi.any().required(),
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
  createPost: async function(post, firestore, callback) {
    // Assign post to this.post
    this.post = {
      userRef: post.userRef,
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
      console.error(result.error, this.post)
      this.callback(result.error, null)
    } else {
      // Get the post document reference and snapshot.
      const postsColRef = firestore.collection('posts')
      // Create a new post document.
      const postDocRef = await postsColRef.add(this.post).catch(err => {
        console.error(err)
        this.callback(err, null)
      })
      this.post.postId = postDocRef.id
      console.log('New post is created at: ' + this.post.createTime)
      this.callback(null, this.post)
    }
  },
  getAllPosts: async function(firestore, callback) {
    // Assign callback to this.callback
    this.callback =
      callback ||
      function(err, post) {
        console.error(err)
        console.log(post)
      }
    // Get the post document reference and snapshot.
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
  userRef: '108089674324201517244',
  displayName: 'koji',
  imageUrl: 'https://tailwindcss.com/img/jonathan.jpg',
  postContent: 'postPostContent'
}

Post.createPost(test)
*/
