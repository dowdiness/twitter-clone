import firebase from '~/plugins/firebase'
import { vuexfireMutations, firestoreAction } from 'vuexfire'
import { format } from 'date-fns'
// import fromUnixTime from 'date-fns/fromUnixTime'

const firestore = firebase.firestore()
const postsRef = firestore.collection('posts').orderBy('createTime', 'desc')
const usersRef = firestore.collection('users')

export const state = () => ({
  user: {
    userId: null,
    displayName: null,
    avatarUrl: null,
    pushDevices: []
  },
  posts: [],
  auth: false,
  srcDate: new Date()
})

// Saves the messaging device token to the datastore.
function saveMessagingDeviceToken(messaging) {
  messaging
    .getToken()
    .then(function(currentToken) {
      if (currentToken) {
        console.log('Got FCM device token:', currentToken)
        // Saving the Device Token to the datastore.
        firebase
          .firestore()
          .collection('fcmTokens')
          .doc(currentToken)
          .set({ userRef: usersRef.doc(state.user.userId) })
      } else {
        // Need to request permissions to show notifications.
        requestNotificationsPermissions()
      }
    })
    .catch(function(error) {
      console.error('Unable to get messaging token.', error)
    })
}

// Requests permissions to show notifications.
function requestNotificationsPermissions(messaging) {
  console.log('Requesting notifications permission...')
  messaging
    .requestPermission()
    .then(function() {
      // Notification permission granted.
      console.log('Success to get permission')
      saveMessagingDeviceToken()
    })
    .catch(function(error) {
      console.error('Unable to get permission to notify.', error)
    })
}

export const getters = {
  getPostTimes: state => {
    return state.posts
  },
  getUserId: state => {
    return state.user.userId
  },
  getDisplayName: state => {
    return state.user.displayName
  }
}

export const mutations = {
  login(state, payload) {
    if (payload) {
      state.auth = true
      state.user = payload
    }
  },
  logout(state) {
    state.auth = false
    state.user = {
      userId: null,
      displayName: null,
      avatarUrl: null,
      pushDevices: []
    }
  },
  addPost(state, payload) {
    if (state.user.userId) {
      payload.userRef = usersRef.doc(state.user.userId)
      payload.createTime = format(new Date(), 'yyyy/MM/dd-HH:mm:ss')
      state.posts.push(payload)
    }
  },
  uploadDate(state) {
    state.srcDate = new Date().getTime()
  },
  createToken(state, pushDevice) {
    const messaging = firebase.messaging()
    messaging.usePublicVapidKey(process.env.FCM_PUBLICKEY)
    console.log('Requesting notifications permission...')
    messaging
      .requestPermission()
      .then(function() {
        // Notification permission granted.
        console.log('Success to get permission')
        messaging
          .getToken()
          .then(function(currentToken) {
            if (currentToken) {
              console.log('Got FCM device token')
              // Saving the Device Token to the datastore.
              firebase
                .firestore()
                .collection('fcmTokens')
                .doc(currentToken)
                .set({
                  userRef: usersRef.doc(state.user.userId),
                  pushDevice: pushDevice
                })
            } else {
              // Need to request permissions to show notifications.
              console.log('Unable to get FCM device token:')
            }
          })
          .catch(function(error) {
            console.error('Unable to get messaging token.', error)
          })
      })
      .catch(function(error) {
        console.error('Unable to get permission to notify.', error)
      })
  },
  ...vuexfireMutations
}

export const actions = {
  nuxtServerInit({ dispatch }) {
    dispatch('INIT_POSTS')
  },
  INIT_POSTS: firestoreAction(({ bindFirestoreRef }) => {
    bindFirestoreRef('posts', postsRef)
  }),
  ADD_POST: firestoreAction(({ state }, { postContent }) => {
    const user = { ...state.user }
    const userRef = usersRef.doc(user.userId)
    const createTime = format(new Date(), 'yyyy/MM/dd-HH:mm:ss')
    return firestore.collection('posts').add({
      userRef: userRef,
      displayName: user.displayName,
      createTime: createTime,
      postContent: postContent
    })
  })
}
