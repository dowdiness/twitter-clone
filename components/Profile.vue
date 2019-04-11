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
        :src="imageUrl"
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
    >
      Save
    </button>
  </form>
</template>

<script>
export default {
  data: function() {
    return {
      user: {
        name: String,
        avatar: String,
        tweet: String
      },
      response: null,
      uploadImage: null,
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
        this.uploadImage = event.target.files[0]
        this.imageUrl = window.URL.createObjectURL(this.uploadImage)
      }
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
