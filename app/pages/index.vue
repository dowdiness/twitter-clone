<template>
  <div>
    <transition name="fade" mode="out-in">
      <loader v-if="isLoading" key="loading" />
      <section
        v-else
        key="main"
        class="min-h-screen flex flex-col lg:flex-row justify-start items-center lg:items-start"
      >
        <component
          :is="header"
          @update:modal="toggleModal = !toggleModal"
          @update:usermodal="toggleUserModal = !toggleUserModal"
        />
        <div class="h-full w-screen lg:w-3/4 mt-20 ml-auto lg:mt-0">
          <tweet />
        </div>
        <modal
          :toggle-modal="toggleModal"
          @update:modal="toggleModal = !toggleModal"
        />
        <user-modal
          :toggle-user-modal="toggleUserModal"
          @update:usermodal="toggleUserModal = !toggleUserModal"
        />
        <button
          v-show="$store.state.auth && isMobile"
          aria-label="post"
          type="button"
          class="mr-4 mb-4 w-12 h-12 fixed pin-r pin-b bg-blue hover:bg-blue-dark text-white font-hairline py-2 px-2 border border-blue rounded-full transition"
          @click="toggleModal = !toggleModal"
        >
          <font-awesome-icon icon="plus" size="2x" />
        </button>
      </section>
    </transition>
  </div>
</template>

<script>
// import debounce from 'lodash/debounce'
import firebase from '~/plugins/firebase'
import Loader from '~/components/Loader.vue'
import Tweet from '~/components/Tweet.vue'
import Modal from '~/components/Modal.vue'
import UserModal from '~/components/UserModal.vue'
import MobileHeader from '~/components/MobileHeader.vue'
import DesktopHeader from '~/components/DesktopHeader.vue'
import SignInHeader from '~/components/SignInHeader.vue'

export default {
  components: {
    Loader,
    Tweet,
    Modal,
    UserModal,
    MobileHeader,
    DesktopHeader,
    SignInHeader
  },
  data() {
    return {
      toggleModal: false,
      toggleUserModal: false,
      width: null,
      isMobile: false,
      isLoading: true,
      header: null
    }
  },
  async mounted() {
    if (firebase.messaging.isSupported()) {
      const messaging = firebase.messaging()
      messaging.onMessage(payload => {
        this.$toast.show(payload.notification.title).goAway(2500)
      })
    }
    await this.$store.dispatch('INIT_POSTS')
    this.width = window.innerWidth
    if (this.width < 992) {
      this.isMobile = true
      this.header = this.$store.state.auth ? 'mobile-header' : 'sign-in-header'
    } else {
      this.isMobile = false
      this.header = this.$store.state.auth ? 'desktop-header' : 'sign-in-header'
    }
    window.addEventListener('resize', this.handleResize, 400)
    setTimeout(_ => {
      this.isLoading = false
      if (this.$route.hash === '#login') {
        this.$toast
          .success('Login successed!', { icon: { name: 'check' } })
          .goAway(1500)
      } else if (this.$route.hash === '#logout') {
        this.$toast
          .info('Logout successed!', { icon: { name: 'check' } })
          .goAway(1500)
      }
    }, 500)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize, 400)
  },
  methods: {
    handleResize: function() {
      this.width = window.innerWidth
      if (this.width < 992) {
        this.isMobile = true
        this.header = this.$store.state.auth
          ? 'mobile-header'
          : 'sign-in-header'
      } else {
        this.isMobile = false
        this.header = this.$store.state.auth
          ? 'desktop-header'
          : 'sign-in-header'
      }
    }
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  will-change: opacity;
  transition: opacity 1s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.transition {
  transition: all 0.3s ease;
}
</style>
