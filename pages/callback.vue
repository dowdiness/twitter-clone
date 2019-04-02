<template>
  <p>callback</p>
</template>

<script>
export default {
  data() {
    return {
      user: null
    }
  },
  async mounted() {
    const res = await this.$axios.get('/api/auth/callback', {
      params: this.$route.query
    })
    console.log(res.data.user)
    const user = {
      userId: res.data.user.userId,
      displayName: res.data.user.displayName,
      avatarUrl: res.data.user.avatarUrl
    }
    this.$store.commit('login', user)
    this.$router.push('/')
  }
}
</script>
