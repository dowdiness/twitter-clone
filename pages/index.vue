<template>
  <section class="min-h-screen flex flex-col justify-center items-center">
    <div
      class="h-24 w-screen flex flex-col border-grey-light border-solid border-b"
    >
      <div class="h-12 w-screen flex justify-start items-center">
        <img
          v-if="$store.state.user"
          class="w-8 h-8 rounded-full ml-4"
          :src="$store.state.user.avatarUrl"
        />
        <div v-if="$store.state.user" class="ml-4 font-bold">
          {{ $store.state.user.displayName }}
        </div>
        <a
          v-if="!$store.state.auth"
          class="ml-4 bg-transparent hover:bg-blue text-blue-dark font-semibold hover:text-white py-2 px-4 border border-blue hover:border-transparent rounded"
          href="/api/auth/login"
          >Sign In with Google</a
        >
        <a
          v-if="$store.state.auth"
          class="ml-4 bg-transparent hover:bg-blue text-blue-dark font-semibold hover:text-white py-2 px-4 border border-blue hover:border-transparent rounded"
          href="/api/auth/logout"
          >Logout</a
        >
        <div>{{ $store.state.user.userId }}</div>
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
  }
}
</script>
