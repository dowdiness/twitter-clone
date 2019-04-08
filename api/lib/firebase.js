const firebase = require('firebase')
// Initialize Firebase
const config = {
  apiKey: 'AIzaSyBmUWE93YF_haoiWKFZRRjRRi3tSFPc51U',
  authDomain: 'sns-example-db82a.firebaseapp.com',
  databaseURL: 'https://sns-example-db82a.firebaseio.com',
  projectId: 'sns-example-db82a',
  storageBucket: 'sns-example-db82a.appspot.com',
  messagingSenderId: '274101989150'
}
firebase.initializeApp(config)
