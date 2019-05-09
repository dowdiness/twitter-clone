<template>
  <section class="flex">
    <textarea
      v-model.trim="postContent"
      cols="20"
      rows="5"
      placeholder="What's happing?"
      class="resize-none border border-gray my-6 mb-4 md:my-6"
    ></textarea>
      <button
        class="upload bg-blue hover:bg-blue-dark text-white font-bold py-2 px-4 rounded"
        type="button"
        @click="upByClient"
      >
        Post
      </button>
      <button
        :class="{ disableBtn: isDisable }"
        aria-label="post"
        type="button"
        class="w-12 h-12 fixed pin-r pin-b bg-blue hover:bg-blue-dark text-white font-hairline py-2 px-2 border border-blue rounded-full transition"
        @click="toggleModal = !toggleModal"
      >
        <font-awesome-icon icon="plus" size="2x" />
      </button>
    </div>
  </section>
</template>

<style scoped>
.cross {
  transition: all 0.4s;
}

.disableBtn {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.upload {
  transition: all 0.4s;
}
</style>

<script>
export default {
  data() {
    return {
      isPopup: false,
      isDisable: true,
      postContent: '',
      uploadImage: null,
      message: 'Start chatting!'
    }
  },
  watch: {
    postContent(val) {
      val === '' ? (this.isDisable = true) : (this.isDisable = false)
    }
  },
  methods: {
    onFileSelected(event) {
      event.preventDefault()
      this.uploadImage = event.target.files[0]
    },
    async upByClient(event) {
      this.$toast.show('Sending your post...', { icon: 'check' })
      this.$emit('update:modal')
      event.preventDefault()
      await this.$store
        .dispatch('ADD_POST', {
          postContent: this.postContent
        })
        .catch(err => {
          console.error(err)
          this.$toast.error('Post is failed...').goAway(1500)
        })
      this.postContent = ''
      this.uploadImage = null
      this.message = 'Start chatting!'
      this.$toast.clear()
      this.$toast
        .success('Successfully posted!', { icon: 'check' })
        .goAway(1500)
    }
  }
}
</script>
