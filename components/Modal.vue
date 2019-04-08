<template>
  <div
    class="fixed pin z-50 overflow-auto bg-smoke-light flex"
    @click.self="$emit('update:modal')"
  >
    <div
      :class="{ fadeOut: !toggleModal }"
      class="fadeIn relative p-8 bg-white w-full max-w-md m-auto flex-col flex"
    >
      <post-tweet @update:modal="$emit('update:modal')" />
    </div>
  </div>
</template>

<style scoped>
.fadeIn {
  animation: fadeIn ease-out 0.7s;
}

.fadeOut {
  animation: fadeOut ease-out 0.3s;
}

@keyframes fadeIn {
  0% {
    transform: translateY(40px);
  }
  100% {
    transform: translateY(0px);
  }
}

@keyframes fadeOut {
  0% {
    transform: translateY(0px);
  }
  100% {
    transform: translateY(-40px);
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
