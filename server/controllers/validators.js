const { check, validationResult} = require('express-validator')

exports.validateSignup = [
  check('username')
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3, max: 20 }).withMessage('Username should be between 3 and 20 characters')
    .isAlphanumeric().withMessage('Username should contain only numbers and letters'),
  check('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Provide a valid Email'),
  check('password')
    .isLength({ min: 6, max: 20 }).withMessage('Password should be between 6 and 20 characters long')
    .matches(/\d/).withMessage('Password must contain a number')
    .matches(/[a-zA-Z]/).withMessage('Password must contain a letter'),
  (req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({errors: errors.array()[0]}); // Return only the first error message
    }
    next();
  }
];
