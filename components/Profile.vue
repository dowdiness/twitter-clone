<template>
  <form class="flex flex-col justify-center items-center">
    <button
      class="cross absolute pin-t pin-r mr-4 mt-4 hover:text-smoke transition"
      type="button"
      @click="$emit('update:usermodal')"
    >
      <font-awesome-icon icon="times" size="lg" />
    </button>
    <input
      ref="imageInput"
      class="hidden"
      type="file"
      name="file"
      accept="image/*"
      @change="onFileSelected"
    />
    <button
      class="m-4 w-32 h-32 rounded-full text-white opacity-75 hover:opacity-100 relative transition"
      type="button"
      @click="$refs.imageInput.click()"
    >
      <font-awesome-icon
        icon="image"
        size="3x"
        class="absolute pin z-50 m-auto opacity-100"
      />
      <img
        class="w-32 h-32 rounded-full m-auto object-cover pin"
        :src="imageUrl | addQuery"
      />
    </button>
    <div class="m-4 p-2 bg-grey-lightest w-full max-w-xs rounded">
      <label
        :class="{ 'text-blue': toggleFocus }"
        class="block text-grey-dark text-sm font-bold mb-2 transition"
        for="username"
        >Name</label
      >
      <input
        id="username"
        v-model="user.name"
        :class="{ 'border-b': toggleFocus, 'border-blue': toggleFocus }"
        class="appearance-none w-full bg-grey-lightest text-grey-darkest leading-tight border-b border-grey-lightest focus:outline-none transition"
        type="text"
        @focus="onFocus"
        @blur="onBlur"
      />
    </div>
    <button
      class="w-full max-w-xs mb-4 bg-blue hover:bg-blue-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      type="button"
      @click="onSave"
    >
      Save
    </button>
  </form>
</template>

<script>
export default {
  filters: {
    addQuery: function(avatarUrl) {
      if (!avatarUrl) return ''
      const isCloudStorage = /^https:\/\/storage.googleapis.com/.test(avatarUrl)
      return isCloudStorage ? `${avatarUrl}?${new Date().getTime()}` : avatarUrl
    }
  },
  data: function() {
    return {
      user: {
        name: String,
        avatarImage: null
      },
      response: null,
      imageUrl: '',
      toggleFocus: false
    }
  },
  mounted() {
    this.user.name = this.$store.state.user.displayName
    this.imageUrl = this.$store.state.user.avatarUrl
  },
  methods: {
    onFileSelected(event) {
      event.preventDefault()
      if (event.target.files[0]) {
        this.user.avatarImage = event.target.files[0]
        this.imageUrl = window.URL.createObjectURL(this.user.avatarImage)
      }
    },
    async onSave() {
      this.$emit('update:usermodal')
      this.$toast.show('Saving new profile...', { icon: { name: 'check' } })
      const form = new FormData()
      form.append('userId', this.$store.state.user.userId)
      form.append('displayName', this.user.name)
      if (this.user.avatarImage) {
        form.append(
          'image',
          this.user.avatarImage,
          this.$store.state.user.userId
        )
      }
      const res = await this.$axios
        .post(`/api/users`, form, {
          headers: {
            'content-type': 'multipart/form-data'
          }
        })
        .catch(err => {
          console.log(err.response.data)
          this.$toast.error('Error while saving', { icon: 'error_outline' })
        })
      console.log(res)
      const user = {
        userId: res.data.userId,
        displayName: res.data.displayName,
        avatarUrl: res.data.avatarUrl
      }
      this.$store.commit('login', user)
      await this.$store.dispatch('INIT_POSTS')
      this.imageUrl = this.$store.state.user.avatarUrl
      this.$emit('update:image')
      this.$toast.clear()
      this.$toast
        .success('Successfully saved!', { icon: { name: 'check' } })
        .goAway(1500)
    },
    onFocus() {
      this.toggleFocus = true
    },
    onBlur() {
      this.toggleFocus = false
    }
  }
}
</script>

<style scoped>
.transition {
  transition: all 0.3s ease;
}
</style>
