export default async ({ app, store, route, redirect }) => {
  if (store.state.auth) {
    return
  }

  const res = await app.$axios.get('/api/auth/session')
  if (res.data.user) {
    store.commit('login', res.data.user)
    if (route.path !== '/') {
      return redirect('/')
    }
  } else {
    store.commit('logout')
  }
}
