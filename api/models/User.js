const Joi = require('joi')

const User = {
  userSchema: Joi.object().keys({
    userId: Joi.string()
      .length(21)
      .required(),
    displayName: Joi.string()
      .min(1)
      .required(),
    avatarUrl: Joi.string()
  }),
  findOrCreate: async function(user, firestore, callback) {
    // Assign User to this.user
    this.user = {
      userId: user.id,
      displayName: user.displayName,
      avatarUrl: user.photos[0].value
    }
    // Assign callback to this.callback
    this.callback =
      callback ||
      function(err, user) {
        console.error(err)
        console.log(user)
      }

    // Validate user data
    const result = Joi.validate(this.user, this.userSchema)
    if (result.error) {
      this.callback(result.error, this.user)
      return
    }

    // Get the user document reference and snapshot.
    const usersColRef = firestore.collection('users')
    const userDocRef = usersColRef.doc(this.user.userId)
    const userDocSnapshot = await userDocRef.get().catch(err => {
      console.log(err)
    })
    // Check if the user document exist.
    if (!userDocSnapshot.exists) {
      // Update a new user document.
      const setRes = await userDocRef.set(this.user).catch(err => {
        console.log(err)
      })
      console.log('New user is created at: ' + setRes.writeTime.toDate())
      this.callback(result.error, this.user)
    } else {
      const userDocSnap = await firestore
        .doc(`users/${this.user.userId}`)
        .get()
        .catch(err => {
          console.log(err)
          this.callback(err, null)
          console.log('Login is failed at: ', new Date())
        })
      this.user = userDocSnap.data()
      console.log('Existing user is logined at: ', new Date())
      this.callback(null, this.user)
    }
  },
  getUserRefById: function(id, firestore) {
    // Get the user document reference and snapshot.
    try {
      const userDocRef = firestore.doc(`users/${id}`)
      return userDocRef
    } catch (e) {
      console.error(e)
    }
  },
  updateUser: async function(user, firestore, callback) {
    const userDocRef = firestore.doc(`users/${user.userId}`)
    const res = await userDocRef.update(user).catch(err => {
      console.error(err)
      callback(err, null)
    })
    console.log(res)
    callback(null, user)
  }
}

module.exports = User
