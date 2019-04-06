import pkg from './package'
require('dotenv').config()

export default {
  mode: 'universal',

  /*
   ** Headers of the page
   */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },

  /*
   ** Global CSS
   */
  css: ['~/assets/css/tailwind.css'],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['~/plugins/vue-fontawesome', '~/plugins/axios'],

  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/proxy',
    'nuxt-webfontloader'
  ],
  webfontloader: {
    google: {
      families: [
        'Montserrat:400,700',
        'Noto+Sans+JP:400,700',
        'Noto+Serif+JP:400,700'
      ]
    }
  },
  manifest: {
    name: 'sns-example',
    lang: 'ja'
  },
  /*
   ** Axios module configuration
   */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    proxy: true
  },
  proxy: {
    '/api': {
      target: 'https://sns-example-db82a.appspot.com',
      pathRewrite: {
        '^/api': '/'
      }
    }
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },
  router: {
    middleware: 'session'
  },
  serverMiddleware: [
    // API middleware
    '~/api/app.js'
  ],
  LoadingIndicator: {
    name: 'circle',
    color: '#3B8070',
    background: 'white'
  },
  env: {
    GOOGLE_APPLICATION_CREDENTIALS: '~/appSecret.json',
    GCLOUD_STORAGE_BUCKET: process.env.GCLOUD_STORAGE_BUCKET
  }
}
