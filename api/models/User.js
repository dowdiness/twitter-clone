const Firestore = require('@google-cloud/firestore')
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
  findOrCreate: async function(user, callback) {
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
    const firestore = new Firestore()
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
      // Update an existing user document, if user document is alredeay existed.
      const updatedRes = await userDocRef.update(this.user).catch(err => {
        console.log(err)
      })
      console.log('Update the existing user', updatedRes.writeTime.toDate())
      this.callback(result.error, this.user)
    }
  }
}

module.exports = User
