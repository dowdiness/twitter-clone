/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/5.9.4/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/5.9.4/firebase-messaging.js')

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: 'AIzaSyBmUWE93YF_haoiWKFZRRjRRi3tSFPc51U',
    authDomain: 'sns-example-db82a.firebaseapp.com',
    databaseURL: 'https://sns-example-db82a.firebaseio.com',
    projectId: 'sns-example-db82a',
    storageBucket: 'sns-example-db82a.appspot.com',
    messagingSenderId: '274101989150'
  })
}

const messaging = firebase.messaging()

messaging.setBackgroundMessageHandler(function(payload) {
  const title = payload.data.notification.title
  const options = {
    body: payload.data.notification.body
  }
  return self.registration.showNotification(title, options)
})
