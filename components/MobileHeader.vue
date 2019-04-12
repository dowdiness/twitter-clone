<template>
  <div
    v-show="$store.state.auth"
    class="h-20 fixed w-screen bg-white flex flex-col justify-start items-center border-grey-light lg:border-white border-solid border-b"
  >
    <div
      v-show="isPopup"
      class="absolute bg-transparent w-screen h-screen"
      @click.self="isPopup = false"
    ></div>
    <div class="h-12 m-auto w-screen flex justify-between items-center">
      <div class="ml-4 font-bold text-center">
        {{ $store.state.user.displayName }}
      </div>
      <div class="drop mr-4">
        <transition name="drop">
          <ul
            v-show="isPopup"
            class="dropdown absolute list-reset bg-white shadow-md w-24 z-50"
          >
            <li
              class="px-2 py-3 text-center font-bold border border-b-0 hover:bg-blue hover:text-white transition"
              @click="profile"
            >
              Profile
            </li>
            <li class="text-center font-bold border">
              <a
                class="no-underline block text-black hover:bg-blue hover:text-white p-3 transition"
                href="/api/auth/logout"
                @touchstart="isPopup = false"
                @click="isPopup = false"
              >
                Logout
              </a>
            </li>
          </ul>
        </transition>
        <button
          aria-label="profile"
          type="button"
          class="w-12 h-12 rounded-full z-50"
          @touchstart.prevent="isPopup = true"
          @mouseover.prevent="isPopup = true"
        >
          <img
            class="w-12 h-12 rounded-full object-cover"
            :src="$store.state.user.avatarUrl | addQuery"
            alt="userAvatar"
          />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dropdown {
  right: 0.5rem;
  top: 5rem;
}

.drop-enter-active,
.drop-leave-active {
  transition: all 1s;
}
.drop-enter,
.drop-leave-to {
  opacity: 0;
  top: 4rem;
}

.transition {
  transition: all ease 0.3s;
}
.arrow {
  position: relative;
  color: #000;
  vertical-align: middle;
  text-decoration: none;
}
.arrow::after {
  position: absolute;
  top: 0px;
  bottom: 0;
  left: 3rem;
  width: 1rem;
  height: 1rem;
  border-top: 2px solid grey;
  border-right: 2px solid grey;
  transform: rotate(135deg);
  margin: auto;
  content: '';
  vertical-align: middle;
  transition: transform ease 0.4s;
}

.drop:hover .arrow::after {
  transform: rotate(-45deg);
}
</style>

<script>
export default {
  filters: {
    addQuery: function(avatarUrl) {
      if (!avatarUrl) return ''
      const isCloudStorage = /^https:\/\/storage.googleapis.com/.test(avatarUrl)
      return isCloudStorage ? `${avatarUrl}?${new Date().getTime()}` : avatarUrl
    }
  },
  props: {
    updateTime: {
      type: Date,
      default: new Date()
    }
  },
  data() {
    return {
      isPopup: false
    }
  },
  methods: {
    profile: function() {
      this.$emit('update:usermodal')
      this.isPopup = false
    }
  }
}
</script>
