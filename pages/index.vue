<template>
  <section class="min-h-screen flex flex-col justify-start items-center">
    <div
      v-if="$store.state.auth"
      class="h-24 w-screen flex flex-col justify-start items-center border-grey-light border-solid border-b"
    >
      <div class="h-12 w-screen flex justify-between items-center">
        <img
          class="w-8 h-8 rounded-full ml-4"
          :src="$store.state.user.avatarUrl"
        />
        <div v-if="$store.state.auth" class="mr-4 font-bold">
          {{ $store.state.user.displayName }}
        </div>
      </div>
      <div class="h-12 w-screen flex justify-between items-center">
        <button
          class="ml-4 bg-blue hover:bg-blue-dark text-white font-bold py-2 px-4 border border-blue rounded"
          @click="toggleModal = !toggleModal"
        >
          Tweet
        </button>
        <div class="ml-auto mr-4">
          <a
            v-if="$store.state.auth"
            class="bg-transparent hover:bg-blue text-blue-dark font-semibold hover:text-white py-2 px-4 border border-blue hover:border-transparent rounded"
            href="/api/auth/logout"
            >Logout</a
          >
        </div>
      </div>
    </div>
    <div
      v-else
      class="h-12 w-screen flex justify-center items-center border-grey-light border-solid border-b"
    >
      <a
        v-if="!$store.state.auth"
        class="bg-transparent hover:bg-blue text-blue-dark font-semibold hover:text-white py-2 px-4 border border-blue hover:border-transparent rounded"
        href="/api/auth/login"
        >Sign In with Google</a
      >
    </div>
    <div class="h-full w-screen">
      <tweet
        :posts="posts"
        post-time="test"
        post-avatar="https://tailwindcss.com/img/jonathan.jpg"
      />
    </div>
    <modal
      :toggle-modal="toggleModal"
      @update:modal="toggleModal = !toggleModal"
    />
  </section>
</template>

<script>
import Tweet from '~/components/Tweet.vue'
import Modal from '~/components/Modal.vue'

export default {
  components: {
    Tweet,
    Modal
  },
  data() {
    return {
      toggleModal: false
    }
  },
  async asyncData({ app }) {
    const posts = await app.$axios.get('/api/posts')
    return { posts: posts.data }
  }
}
</script>
