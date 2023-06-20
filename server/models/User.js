const mongoose = require('mongoose')
const validator = require('validator')
const { hashPassword, comparePasswords} = require('../utils/bcryptUtils')
const { createPasswordResetToken } = require('../utils/cryptoUtils')

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'A user must have a username'],
      unique: true
    },
    email: {
      type: String,
      require: [true, 'A user must have an email'],
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, 'Please provide a valid email']
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minLength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      validate: {
        validator: function (el) {
          return el === this.password
        },
        message: 'Passwords are not the same'
      }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    displayName: {
      type: String,
      required: false
    }
  },
  {
    timestamps: true
  }
)


userSchema.add({
  active: {
    type: Boolean,
    default: true,
    select: false
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationTokenExpires: Date,
})

userSchema.methods.correctPassword = async function (candidatePassword) {
  return await comparePasswords(candidatePassword,this.password)
}

userSchema.methods.setPasswordResetToken = function () {
  const {resetToken, passwordResetToken, passwordResetExpires} = createPasswordResetToken()
  this.passwordResetToken = passwordResetToken
  this.passwordResetExpires = passwordResetExpires

  return resetToken
}

userSchema.pre('save', async function(next) {
  // Only run this function is password was actually modified
  if (!this.isModified('password')) return next()

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password,12)

  // Delete passwordConfirm field
  this.passwordConfirm = undefined

  if (this.isModified('password') && !this.isNew) {
    this.passwordChangedAt = Date.now() - 1000; 
  }

  this.username = validator.escape(this.username);
  this.email = validator.escape(this.email);
  this.displayName = validator.escape(this.displayName);

  next()
})

userSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({active: { $ne: false}})
  next()
})

const User = mongoose.model('User',userSchema)

module.exports = User