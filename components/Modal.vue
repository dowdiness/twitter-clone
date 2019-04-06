<template>
  <div
    v-if="toggleModal"
    class="fixed pin z-50 overflow-auto bg-smoke-light flex"
    @click.self="$emit('update:modal')"
  >
    <div
      class="fadeIn relative p-8 bg-white w-full max-w-md m-auto flex-col flex"
    >
      <post-tweet />
    </div>
  </div>
</template>

<style scoped>
.fadeIn {
  animation: fadeIn ease-out 1.4s;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(40px);
  }
  100% {
    opacity: 1;
    transform: translateY(0px);
  }
}
</style>

<script>
import PostTweet from '~/components/PostTweet.vue'

export default {
  components: {
    PostTweet
  },
  props: {
    toggleModal: {
      type: Boolean,
      default: false
    }
  }
}
</script>
