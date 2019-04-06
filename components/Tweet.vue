<template>
  <ul class="list-reset">
    <li
      v-for="post in posts"
      :key="post.userId"
      class="h-24 w-screen border-grey-lighter border-solid border-b"
    >
      <div class="flex my-4">
        <div class="w-1/5 flex flex-col justify-start items-center">
          <img class="w-12 h-12 rounded-full" :src="avatarUrl" />
        </div>
        <div class="mx-2 h-full w-4/5 text-xs">
          <ul class="list-reset flex">
            <li class="font-bold">{{ post.displayName }}</li>
            <li class="ml-2 text-grey-darker">{{ postTime }}</li>
          </ul>
          <div class="my-2 font-serif">
            {{ post.postContent }}
          </div>
        </div>
      </div>
    </li>
  </ul>
</template>

<script>
import ninja from '~/static/27-ninja.svg'

export default {
  props: {
    posts: {
      type: Array,
      default: null
    },
    postTime: {
      type: String,
      default: '20190403'
    },
    avatarUrl: {
      type: String,
      default: ninja
    }
  }
}
</script>
