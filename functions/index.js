const functions = require('firebase-functions').region('asia-northeast1')

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const admin = require('firebase-admin')
admin.initializeApp()

/*
// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original
exports.addMessage = functions.https.onRequest((req, res) => {
  // Grab the text parameter.
  const original = req.query.text
  // Push the new message into the Realtime Database using the Firebase Admin SDK.
  return admin
    .database()
    .ref('/messages')
    .push({ original: original })
    .then(snapshot => {
      // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
      return res.redirect(303, snapshot.ref.toString())
    })
})

// Listens for new messages added to /messages/:pushId/original and creates an
// uppercase version of the message to /messages/:pushId/uppercase
exports.makeUppercase = functions.database
  .ref('/messages/{pushId}/original')
  .onCreate((snapshot, context) => {
    // Grab the current value of what was written to the Realtime Database.
    const original = snapshot.val()
    console.log('Uppercasing', context.params.pushId, original)
    const uppercase = original.toUpperCase()
    // You must return a Promise when performing asynchronous tasks inside a Functions such as
    // writing to the Firebase Realtime Database.
    // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
    return snapshot.ref.parent.child('uppercase').set(uppercase)
  })
*/

exports.sendPush = functions.firestore
  .document('posts/{postId}')
  .onCreate(async (snap, context) => {
    // Get the list of device tokens.
    const tokensSnapshot = await admin
      .firestore()
      .collection('fcmTokens')
      .get()
      .catch(e => {
        console.error(e)
      })
    const allTokens = []
    tokensSnapshot.forEach(tokenDoc => {
      if (tokenDoc.data().pushDevice.getNortification) {
        allTokens.push(tokenDoc.id)
      }
    })
    // Make a message object
    const newPost = snap.data()
    let userSnapshot = await admin
      .firestore()
      .doc(`users/${newPost.userRef._path.segments[1]}`)
      .get()
      .catch(e => {
        console.error('Error getting userSnapshot', e)
      })
    let userData = userSnapshot.data()
    console.log(userData)
    console.log(allTokens)
    const message = {
      name: snap.id,
      notification: {
        title: `New post by ${userData.displayName}`,
        body: newPost.postContent
      },
      webpush: {
        fcm_options: {
          link: 'https://sns-example-db82a.appspot.com'
        }
      },
      tokens: allTokens
    }
    console.log(message)
    if (allTokens.length > 0) {
      console.log('Send notifications to all tokens.')
      // Send notifications to all tokens.
      const res = await admin
        .messaging()
        .sendMulticast(message)
        .catch(e => {
          console.error('Error sending message', e)
        })
      // await cleanupTokens(response, tokens)
      const errors = res.responses.map(eachPush => {
        if (eachPush.success === false) {
          console.log(eachPush.error)
          console.log(JSON.stringify(eachPush.error))
          return eachPush.error
        }
        return eachPush
      })
      console.log('Notifications have been sent.', errors)
    }
  })
