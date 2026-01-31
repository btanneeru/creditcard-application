const jwt = require('jsonwebtoken')
const { buildErrObject } = require('../../../../v1/middlewares/buildErrObject')
const { decrypt } = require('../../../middlewares/auth')

/**
 * Gets user id from token
 * @param {string} token - Encrypted and encoded token
 */
const getUserIdFromToken = (token = '') => {
  return new Promise((resolve, reject) => {
    // Decrypts, verifies and decode token
    jwt.verify(decrypt(token), process.env.JWT_SECRET_REFRESH_TOKEN, (err, decoded) => {
      if (err) {
        reject(buildErrObject(409, 'BAD_TOKEN'))
      }
      resolve(decoded.data._id)
    })
  })
}

module.exports = { getUserIdFromToken }
