<template>
  <section class="min-h-screen flex flex-col justify-center items-center">
    <div
      class="h-32 w-screen flex flex-col border-grey-light border-solid border-b"
    >
      <div class="h-16 w-screen flex justify-start items-center">
        <img
          class="w-10 h-10 rounded-full ml-4"
          src="https://tailwindcss.com/img/jonathan.jpg"
        />
        <div class="ml-4 font-bold">{{ response }}</div>
        <div class="ml-auto mr-4">
          <font-awesome-icon icon="cog" size="2x" />
        </div>
      </div>
      <ul class="h-16 w-screen flex justify-around items-center list-reset">
        <li>
          <font-awesome-icon class="text-blue" icon="home" size="2x" />
        </li>
        <li>
          <font-awesome-icon class="text-blue" icon="search" size="2x" />
        </li>
        <li>
          <font-awesome-icon class="text-blue" icon="bell" size="2x" />
        </li>
        <li>
          <font-awesome-icon class="text-blue" icon="envelope" size="2x" />
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
      },
      response: null
    }
  },
  mounted: function() {
    this.$axios
      .$get('/api/users')
      .then(response => {
        this.response = response
      })
      .catch(error => {
        console.log(error)
      })
  }
}
</script>
