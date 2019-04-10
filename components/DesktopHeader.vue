<template>
  <div
    v-show="$store.state.auth"
    class="h-screen m-auto fixed w-1/4 bg-white flex flex-col justify-center items-center border-white border-solid border-b"
  >
    <div
      class="h-12 m-0 h-auto w-full flex flex-col justify-between items-center"
    >
      <img
        class="w-24 h-24 rounded-full m-auto object-cover"
        :src="$store.state.user.avatarUrl"
      />
      <div class="mx-4 mt-12 font-bold text-center text-xl">
        {{ $store.state.user.displayName }}
      </div>
    </div>
    <div
      v-show="$store.state.auth"
      class="h-32 mt-12 w-full flex flex-col justify-between items-center"
    >
      <button
        class="mx-4 mt-4 w-5/6 bg-blue hover:bg-blue-dark text-white font-bold py-2 px-4 border border-blue rounded"
        @click="$emit('update:modal')"
      >
        Post
      </button>
      <div class="mx-4 mb-4 w-5/6">
        <a
          class="bg-transparent block hover:bg-blue text-blue-dark font-semibold hover:text-white text-center py-2 px-4 border border-blue hover:border-transparent rounded"
          href="/api/auth/logout"
          >Logout
        </a>
      </div>
    </div>
  </div>
</template>
