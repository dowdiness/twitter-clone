const crypto = require('crypto')

const hash = function(str) {
  if (typeof str === 'string' && str.length > 0) {
    const hash = crypto
      .createHmac('sha256', process.env.HASHINGSECRET)
      .update(str)
      .digest('hex')
    return hash
  } else {
    return false
  }
}

module.exports = hash
