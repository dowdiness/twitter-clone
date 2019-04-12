<template>
  <transition name="modal">
    <div
      v-show="toggleUserModal"
      class="fixed pin z-50 overflow-auto bg-smoke-light flex"
      @click.self="$emit('update:usermodal')"
    >
      <div
        :class="{ fadeOut: !toggleUserModal }"
        class="fadeIn relative p-4 bg-white w-full max-w-md m-auto flex-col flex shadow-md"
      >
        <profile
          @update:usermodal="$emit('update:usermodal')"
          @update:image="$emit('update:image')"
        />
      </div>
    </div>
  </transition>
</template>

<style scoped>
.modal-enter-active {
  transition: all 0.4s ease-out;
}

.modal-leave-active {
  transition: all 0.2s ease-out;
}

.modal-enter,
.modal-leave-to {
  opacity: 0;
}

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
import Profile from '~/components/Profile.vue'

export default {
  components: {
    Profile
  },
  props: {
    toggleUserModal: {
      type: Boolean,
      default: false
    }
  }
}
</script>
