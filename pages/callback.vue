<template>
  <div class="flex flex-col justify-center items-center w-screen h-screen">
    <ring-loader :color="loaderColor"></ring-loader>
    <h3 class="mt-8 text-blue-darker loading">
      <span>L</span>
      <span>O</span>
      <span>A</span>
      <span>D</span>
      <span>I</span>
      <span>N</span>
      <span>G</span>
    </h3>
  </div>
</template>

<style scoped>
.loading span {
  display: inline-block;
  animation: loading 1.4s infinite alternate;
}
.loading span:nth-child(2) {
  animation-delay: 0.1s;
}
.loading span:nth-child(3) {
  animation-delay: 0.2s;
}
.loading span:nth-child(4) {
  animation-delay: 0.3s;
}
.loading span:nth-child(5) {
  animation-delay: 0.4s;
}
.loading span:nth-child(6) {
  animation-delay: 0.5s;
}
.loading span:nth-child(7) {
  animation-delay: 0.6s;
}
@keyframes loading {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>

<script>
import { RingLoader } from '@saeris/vue-spinners'

export default {
  components: {
    RingLoader
  },
  data() {
    return {
      user: null,
      loaderColor: '#3490dc'
    }
  },
  async mounted() {
    const res = await this.$axios.get('/api/auth/callback', {
      params: this.$route.query
    })
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
