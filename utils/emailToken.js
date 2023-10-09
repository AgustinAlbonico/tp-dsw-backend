const crypto = require('crypto')

const createEmailVerificationToken = () => {
  const token = crypto.randomBytes(32).toString('hex')
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex')
  return { token, hashedToken }
}

module.exports = { createEmailVerificationToken }
