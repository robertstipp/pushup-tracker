const crypto = require('crypto')

const createPasswordResetToken = () => {
  const resetToken = crypto.randomBytes(32).toString('hex')

  const passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')

    return {
      resetToken,
      passwordResetToken,
      passwordResetExpires: Date.now() + 10 * 60 * 1000 // Token expires in 10 minutes
    }
}

module.exports = {createPasswordResetToken}