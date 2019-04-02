export default async ({ app, store, route, redirect }) => {
  // 認証済みの場合は何もしない
  if (store.state.auth) {
    return
  }

  if (route.path !== '/callback') {
    // サーバーのsessionからuser情報を取得する
    const res = await app.$axios.get('/api/auth/session')
    if (res.data.user) {
      store.commit('login', res.data.user)
      if (route.path !== '/') {
        return redirect('/')
      }
    }
  }
}
