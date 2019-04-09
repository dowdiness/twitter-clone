<template>
  <section
    class="min-h-screen flex flex-col lg:flex-row justify-start items-center lg:items-start"
  >
    <div
      v-if="$store.state.auth"
      class="h-24 lg:h-screen lg:m-auto fixed w-screen lg:w-1/4 bg-white flex flex-col justify-start lg:justify-center items-center border-grey-light lg:border-white border-solid border-b"
    >
      <div
        class="h-12 lg:h-auto w-screen lg:w-full flex lg:flex-col justify-between items-center"
      >
        <img
          class="w-8 h-8 lg:w-24 lg:h-24 rounded-full ml-4 lg:m-auto object-cover"
          :src="$store.state.user.avatarUrl"
        />
        <div
          v-if="$store.state.auth"
          class="mr-4 lg:mx-4 lg:mt-12 font-bold text-center lg:text-xl"
        >
          {{ $store.state.user.displayName }}
        </div>
      </div>
      <div
        class="h-12 lg:h-32 lg:mt-12 w-screen lg:w-full flex lg:flex-col justify-between items-center"
      >
        <button
          class="ml-4 lg:mx-4 lg:mt-4 lg:w-5/6 bg-blue hover:bg-blue-dark text-white font-bold py-2 px-4 border border-blue rounded"
          @click="toggleModal = !toggleModal"
        >
          Tweet
        </button>
        <div class="ml-auto mr-4 lg:mx-4 lg:mb-4 lg:w-5/6">
          <a
            v-if="$store.state.auth"
            class="bg-transparent lg:block hover:bg-blue text-blue-dark font-semibold hover:text-white text-center py-2 px-4 border border-blue hover:border-transparent rounded"
            href="/api/auth/logout"
            >Logout</a
          >
        </div>
      </div>
    </div>
    <div
      v-else
      class="h-24 lg:h-screen lg:m-auto fixed bg-white w-screen lg:w-1/4 flex justify-center items-center border-grey-light border-solid border-b lg:border-white"
    >
      <a
        v-if="!$store.state.auth"
        class="bg-transparent hover:bg-blue text-blue-dark font-semibold hover:text-white py-2 px-4 border border-blue hover:border-transparent rounded"
        href="/api/auth/login"
        >Sign In with Google</a
      >
    </div>
    <div class="h-full w-screen lg:w-3/4 mt-24 ml-auto lg:mt-0">
      <tweet
        :posts="$store.state.posts"
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
      toggleModal: false,
      posts: null
    }
  },
  async mounted() {
    await this.$store.dispatch('INIT_POSTS')
  }
}
</script>
