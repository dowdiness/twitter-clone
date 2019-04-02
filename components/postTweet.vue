<template>
  <section>
    <textarea
      v-model="tweet"
      cols="30"
      rows="10"
      placeholder="いまどうしてる？"
    ></textarea>
    <input type="file" name="file" @change="selectedFile" />
    <button type="submit" @click="upload">アップロード</button>
  </section>
</template>

<script>
export default {
  props: {
    tweet: String,
    uploadFile: null
  },
  methods: {
    slectedFile: e => {
      e.preventDefault()
      const files = e.target.files
      this.uploadFile = files[0]
    }
  }
}
</script>
