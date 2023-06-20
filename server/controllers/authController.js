const User = require('../models/userModel')
const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')
const { comparePasswords } = require('../utils/bcryptUtils')
const { createSendToken } = require('../utils/tokenUtils')




exports.signup = catchAsync (async (req, res, next) => {
  const newUser = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    displayName: req.body.displayName
  })

  createSendToken(newUser, 201, res)
})

exports.login = catchAsync(async (req,res,next) => {
  const {email, password} = req.body

  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400))
  }

  const user = await User.findOne({email}).select('+password')

  if (!user || !(await comparePasswords(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401))
  }

  createSendToken(user, 200, res)

})

exports.forgotPassword = catchAsync(async (req,res,next) => {
  // 1. Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email })
  if (!user) {
    return next(new AppError('There is no user with that email address',400))
  }
  // 2. Generate the random reset token
  const resetToken = user.setPasswordResetToken()
  await user.save({ validateBeforeSave: false})

  // 3. Send it to user's email
})

exports.resetPassword = catchAsync(async (req,res,next)=> {
  // 1. Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex')

    const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } });

  // 2. If token has not expires, and there is a user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400))
  }
  user.password = req.body.password
  user.passwordConfirm = req.body.passwordConfirm
  user.passwordResetToken = undefined
  user.passwordResetExpires = undefined

  await user.save()

  // 3. Update changedPasswordAt property for the user

  // 4. Log the user in. send JWT
  createSendToken(user, 200, res)
})

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  })
  res.status(200).json({status: 'success'})
}