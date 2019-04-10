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
    avatarUrl: null
  },
  posts: [],
  auth: false
})

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
      avatarUrl: null
    }
  },
  addPost(state, payload) {
    if (state.user.userId) {
      payload.userRef = usersRef.doc(state.user.userId)
      payload.createTime = format(new Date(), 'yyyy/MM/dd-HH:mm:ss')
      state.posts.push(payload)
    }
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
