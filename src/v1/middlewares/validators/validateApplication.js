const { validateResult } = require('../validateResult')
const { check } = require('express-validator')

/**
 * Validates todo add request
 */
const validateApplication = [
  check('title')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  (req, res, next) => {
    validateResult(req, res, next)
  }
]

module.exports = { validateApplication }
