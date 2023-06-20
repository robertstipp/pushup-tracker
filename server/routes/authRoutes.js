const express = require('express')
const authController = require('../controllers/authController')
const validators = require('../controllers/validators')

const router = express.Router()

router.post('/signup', validators.validateSignup, authController.signup)


router.post('/login', authController.login)
router.get('/logout', authController.logout)

router.post('/forgotPassword', authController.forgotPassword)
router.patch('/resetPassword/:token', authController.resetPassword)


module.exports = router

