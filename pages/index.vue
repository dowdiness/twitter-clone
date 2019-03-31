<template>
  <section class="min-h-screen flex flex-col justify-center items-center">
    <div
      class="h-24 w-screen flex flex-col border-grey-light border-solid border-b"
    >
      <div class="h-12 w-screen flex justify-start items-center">
        <img
          class="w-8 h-8 rounded-full ml-4"
          src="https://tailwindcss.com/img/jonathan.jpg"
        />
        <div class="ml-4 font-bold">{{ names }}</div>
        <div class="ml-auto mr-4">
          <font-awesome-icon icon="cog" size="lg" />
        </div>
      </div>
      <ul class="h-12 w-screen flex justify-around items-center list-reset">
        <li>
          <font-awesome-icon class="text-blue" icon="home" size="lg" />
        </li>
        <li>
          <font-awesome-icon class="text-blue" icon="search" size="lg" />
        </li>
        <li>
          <font-awesome-icon class="text-blue" icon="bell" size="lg" />
        </li>
        <li>
          <font-awesome-icon class="text-blue" icon="envelope" size="lg" />
        </li>
      </ul>
    </div>
    <div class="h-full w-screen">
      <ul class="list-reset">
        <tweet />
        <tweet />
        <tweet />
        <tweet />
        <tweet />
      </ul>
    </div>
  </section>
</template>

<script>
import Tweet from '~/components/Tweet.vue'
export default {
  components: {
    Tweet
  },
  data: function() {
    return {
      user: {
        name: String,
        avatar: String,
        tweet: String
      }
    }
  },
  async asyncData({ $axios }) {
    const users = await $axios.$get('/api/users')
    const names = []
    users.forEach(user => {
      return names.push(user.name)
    })
    return { users, names }
  }
}
</script>
