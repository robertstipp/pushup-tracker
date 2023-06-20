const bcrypt = require('bcryptjs')

const hashPassword = async (password) => {
  return await bcrypt.hash(password,12)
}

const comparePasswords = async (candidatePassword, userPassword) => {
  return await bcrypt.compare(candidatePassword, userPassword)
}

const hashPlainText = async (plainText) => {
  return await bcrypt.hash(plainText,12)
}

module.exports = { hashPassword, comparePasswords, hashPlainText}