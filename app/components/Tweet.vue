<template>
  <ul class="list-reset">
    <li
      v-for="post in $store.state.posts"
      :key="post.createTime"
      class="w-screen lg:w-full border-grey-lighter border-solid border-b lg:border-l"
    >
      <div class="flex py-4">
        <div class="w-1/5 flex flex-col justify-start items-center">
          <img
            class="w-12 h-12 rounded-full"
            :src="post.userRef.avatarUrl | addQuery"
            alt="userAvatar"
          />
        </div>
        <div class="pl-2 pr-4 h-full w-4/5 text-sm">
          <ul class="list-reset flex">
            <li class="font-bold">{{ post.userRef.displayName }}</li>
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
  filters: {
    addQuery: function(avatarUrl) {
      if (!avatarUrl) return ''
      const isCloudStorage = /^https:\/\/storage.googleapis.com/.test(avatarUrl)
      return isCloudStorage ? `${avatarUrl}?${new Date().getTime()}` : avatarUrl
    },
    detectLink: function(text) {
      if (!text) return ''
      const urlReg = /((http(s)?(:\/\/))+(www\.)?([\w\-./])*(\.[a-zA-Z]{2,3}\/?))[^\s\b\n|]*[^.,;:?!@^$ -]/g
      text.replace(urlReg, "<a href='$1' target='_blank'>$1</a>")
    }
  }
}
</script>
