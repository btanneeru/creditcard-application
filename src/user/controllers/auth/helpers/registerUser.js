const User = require('../../../model/user')
const { buildErrObject } = require('../../../../v1/middlewares/buildErrObject')

/**
 * Registers a new user in database
 * @param {Object} req - request object
 */
const registerUser = (req = {}) => {
  return new Promise((resolve, reject) => {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      phone: req.body.phone,
      city: req.body.city,
      country: req.body.country,
      profileImg: req.body.profileImg
    });
    user.save()
      .then((doc) => {
        resolve(doc);
      })
      .catch((err) => {
        reject(buildErrObject(422, err.message));
      });
  })
}

module.exports = { registerUser }
