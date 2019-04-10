<template>
  <ul class="list-reset">
    <li
      v-for="post in posts"
      :key="post.createTime"
      class="w-screen lg:w-full border-grey-lighter border-solid border-b lg:border-l"
    >
      <div class="flex py-4">
        <div class="w-1/5 flex flex-col justify-start items-center">
          <img
            class="w-12 h-12 rounded-full"
            :src="post.userRef.avatarUrl"
            alt="userAvatar"
          />
        </div>
        <div class="pl-2 pr-4 h-full w-4/5 text-sm">
          <ul class="list-reset flex">
            <li class="font-bold">{{ post.displayName }}</li>
            <li class="ml-2 text-grey-darker">{{ post.createTime }}</li>
          </ul>
          <div class="break-words whitespace-normal my-2 font-serif">
            {{ post.postContent }}
          </div>
        </div>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    posts: {
      type: Array,
      default: null
    }
  }
}
</script>
