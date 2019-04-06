<template>
  <section class="flex flex-col">
    <h3 v-if="message">{{ message }}</h3>
    <textarea
      v-model.trim="postContent"
      cols="20"
      rows="5"
      placeholder="いまどうしてる？"
      class="resize-none border border-gray my-6"
    ></textarea>
    <div class="flex justify-between">
      <input
        ref="imageInput"
        class="hidden"
        type="file"
        name="file"
        accept="image/*"
        @change="onFileSelected"
      />
      <button
        class="bg-blue hover:bg-blue-dark text-white font-bold p-2 rounded"
        type="submit"
        @click="$refs.imageInput.click()"
      >
        <font-awesome-icon icon="image" size="lg" />
      </button>
      <button
        class="bg-blue hover:bg-blue-dark text-white font-bold py-2 px-4 rounded"
        type="submit"
        @click="onUpload"
      >
        アップロード
      </button>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      postContent: null,
      uploadImage: null,
      message: null
    }
  },
  methods: {
    onFileSelected(event) {
      event.preventDefault()
      this.uploadImage = event.target.files[0]
    },
    async onUpload(event) {
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
      this.postContent = null
      this.uploadImage = null
      this.message = null
    }
  }
}
</script>
