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
    <div class="w-full max-w-xs flex justify-start items-center mb-6">
      <div
        v-for="pushDevice in user.pushDevices"
        :key="pushDevice.deviceInfo.os"
        class="flex flex-col justify-between items-center"
      >
        <p class="mb-2">{{ pushDevice.deviceInfo.os }}</p>
        <p class="mb-4">{{ pushDevice.deviceInfo.browser }}</p>
        <input v-model="pushDevice.getNortification" type="checkbox" />
      </div>
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
import firebase from '~/plugins/firebase'
import * as UAParser from 'ua-parser-js'
import { cloneDeep } from 'lodash'

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
        avatarImage: null,
        pushDevices: [
          {
            getNortification: false,
            deviceInfo: {
              os: '',
              browser: '',
              ua: ''
            }
          }
        ]
      },
      response: null,
      imageUrl: '',
      toggleFocus: false,
      pushDevices: [
        {
          getNortification: false,
          deviceInfo: {
            os: '',
            browser: '',
            ua: ''
          }
        }
      ]
    }
  },
  computed: {
    getNortification() {
      return this.user.pushDevices.map(device => {
        return device.getNortification
      })
    }
  },
  mounted() {
    this.user.name = this.$store.state.user.displayName
    this.imageUrl = this.$store.state.user.avatarUrl
    const parser = new UAParser()
    const result = parser.getResult()
    const deviceInfo = {
      os: result.os.name || '',
      browser: result.browser.name || '',
      ua: result.ua || ''
    }
    this.user.pushDevices = this.$store.state.user.pushDevices
      ? typeof this.$store.state.user.pushDevices === 'string'
        ? cloneDeep(JSON.parse(this.$store.state.user.pushDevices))
        : this.$store.state.user.pushDevices
      : [
          {
            getNortification: false,
            deviceInfo
          }
        ]
    let foundThisDevice = false
    this.user.pushDevices.map(function(pushDevice, index) {
      if (
        JSON.stringify(deviceInfo) === JSON.stringify(pushDevice.deviceInfo)
      ) {
        this.moveAt(this.user.pushDevices, index, 0)
        foundThisDevice = true
      }
    }, this)
    if (!foundThisDevice) {
      this.user.pushDevices.unshift({
        getNortification: false,
        deviceInfo
      })
    }
    this.$watch(
      'getNortification',
      function(val, oldVal) {
        val.map(function(getNortification, index) {
          if (getNortification !== oldVal[index].getNortification) {
            const isThisDevice = index === 0
            if (isThisDevice && getNortification) {
              this.$store.commit('createToken', this.user.pushDevices[0])
              console.log('Set to push on this device.')
            } else {
              console.log('Set to push on other device.')
            }
          }
        }, this)
        const messaging = firebase.messaging()
        messaging.onMessage(payload => {
          console.log('New post: ', payload)
        })
      },
      {
        deep: true
      }
    )
  },
  methods: {
    moveAt(array, index, at) {
      if (index === at || index > array.length - 1 || at > array.length - 1) {
        return array
      }

      const value = array[index]
      const tail = array.slice(index + 1)

      array.splice(index)

      Array.prototype.push.apply(array, tail)

      array.splice(at, 0, value)

      return array
    },
    onFileSelected(event) {
      event.preventDefault()
      if (event.target.files[0]) {
        this.user.avatarImage = event.target.files[0]
        this.imageUrl = window.URL.createObjectURL(this.user.avatarImage)
      }
    },
    async onSave() {
      this.$emit('update:usermodal')
      this.$toast.show('Saving new profile...')
      const form = new FormData()
      form.append('userId', this.$store.state.user.userId)
      form.append('displayName', this.user.name)
      if (this.user.pushDevices) {
        form.append('pushDevices', JSON.stringify(this.user.pushDevices))
      }
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
          this.$toast.clear()
          this.$toast.error('Error while saving').goAway(2500)
          // eslint-disable-next-line no-useless-return
        })
      console.log(res)
      if (!res) {
        return
      }
      const user = {
        userId: res.data.userId,
        displayName: res.data.displayName,
        avatarUrl: res.data.avatarUrl,
        pushDevices: res.data.pushDevices
      }
      this.$store.commit('login', user)
      await this.$store.dispatch('INIT_POSTS')
      this.imageUrl = this.$store.state.user.avatarUrl
      this.$emit('update:modal')
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
