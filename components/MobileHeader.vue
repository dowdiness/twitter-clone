<template>
  <div
    v-show="$store.state.auth"
    class="h-20 fixed w-screen bg-white flex flex-col justify-start items-center border-grey-light lg:border-white border-solid border-b"
  >
    <div class="h-12 m-auto w-screen flex justify-between items-center">
      <img
        class="w-8 h-8 rounded-full ml-4 object-cover"
        :src="$store.state.user.avatarUrl"
        alt="userAvatar"
      />
      <div class="mr-4 font-bold text-center">
        {{ $store.state.user.displayName }}
      </div>
    </div>
  </div>
</template>
