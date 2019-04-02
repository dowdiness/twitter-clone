export const state = () => ({
  user: {
    userId: null,
    displayName: null,
    avatarUrl: null
  },
  auth: false
})

export const mutations = {
  login(state, payload) {
    if (payload) {
      state.auth = true
      state.user = payload
    }
  },
  logout(state) {
    state.auth = false
    state.user = null
  }
}
