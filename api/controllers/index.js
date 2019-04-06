const express = require('express')
// Require API routes
const users = require('./users')
const auth = require('./auth')
const posts = require('./posts')

const router = express.Router()

// Import API Routes
router.use('/users', users)
router.use('/auth', auth)
router.use('/posts', posts)

module.exports = router
