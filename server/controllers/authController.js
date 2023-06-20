const User = require('../models/userModel')
const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')
const { comparePasswords } = require('../utils/bcryptUtils')

const jwt = require('jsonwebtoken')

const cookieOptions = {
  expiresIn: new Date(
    Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
  ),
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production' ? true : false
};

const signToken = id => {
  return jwt.sign({id}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  })
}




exports.signup = catchAsync (async (req, res, next) => {
  const newUser = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    displayName: req.body.displayName
  })

  const token = signToken(newUser._id)
  res.cookie('jwt', token, cookieOptions)

  if (newUser) {
    newUser.password = undefined;
    newUser.passwordConfirm = undefined
  }

  res.status(201).json({
    status: 'success',
    data: {
      user: newUser
    }
  })
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

  const token = signToken(user._id)

  res.cookie('jwt', token, cookieOptions)
  user.password = undefined

  res.status(200).json({
    status: 'success',
    token,
    data: {
      user,
    }
  })
  
})