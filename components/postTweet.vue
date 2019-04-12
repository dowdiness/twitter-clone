<template>
  <section class="flex flex-col">
    <button
      class="cross absolute pin-t pin-r mr-4 mt-4 hover:text-smoke"
      type="button"
      @click="$emit('update:modal')"
    >
      <font-awesome-icon icon="times" size="lg" />
    </button>
    <h3 v-if="message">{{ message }}</h3>
    <textarea
      v-model.trim="postContent"
      cols="20"
      rows="5"
      placeholder="What's happing?"
      class="resize-none border border-gray my-6 mb-4 md:my-6"
    ></textarea>
    <span
      :class="{ popuped: isPopup }"
      class="popup absolute p-2 bg-blue text-white rounded"
      >画像を追加
    </span>
    <div class="flex justify-end">
      <!--
      <input
        ref="imageInput"
        class="hidden"
        type="file"
        name="file"
        accept="image/*"
        @change="onFileSelected"
      />
      <button
        class="addImage bg-blue hover:bg-blue-dark text-white font-bold p-2 rounded"
        type="button"
        @click="$refs.imageInput.click()"
        @mouseover="isPopup = true"
        @mouseleave="isPopup = false"
      >
        <font-awesome-icon icon="image" size="lg" />
      </button>
      -->
      <button
        :class="{ disableBtn: isDisable }"
        class="upload bg-blue hover:bg-blue-dark text-white font-bold py-2 px-4 rounded"
        type="button"
        @click="upByClient"
      >
        Post
      </button>
    </div>
  </section>
</template>

<style scoped>
.cross {
  transition: all 0.4s;
}

.popup {
  opacity: 0;
  top: 160px;
  left: 5px;
  transition: all 0.3s;
}

.popuped {
  opacity: 1;
  top: 150px;
}

.popup::before {
  content: '';
  position: absolute;
  top: 97%;
  left: 40px;
  border: 6px solid transparent;
  border-top: 6px solid #3490dc;
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
    async onUpload(event) {
      if (this.postContent === '') {
        this.message = 'Please type something!'
      } else {
        this.$emit('update:modal')
        event.preventDefault()
        const form = new FormData()
        form.append('postContent', this.postContent)
        if (this.uploadImage) {
          form.append('image', this.uploadImage, this.uploadImage.name)
        }
        const res = await this.$axios
          .post('/api/posts', form, {
            headers: {
              'content-type': 'multipart/form-data'
            }
          })
          .catch(err => {
            this.message = err.response.data
          })
        if (res) {
          this.message = res.data
        }
        this.postContent = ''
        this.uploadImage = null
        this.message = null
      }
    },
    async upByClient(event) {
      this.$toast.show('Sending your post...', { icon: 'check' })
      this.$emit('update:modal')
      event.preventDefault()
      await this.$store.dispatch('ADD_POST', {
        postContent: this.postContent
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
