const User = require("../model/user");

/**
 * Finds user by email
 * @param {string} email - user's email
 */
const findUser = async (email = "") => {
  return new Promise((resolve, reject) => {
    try {
      User.findOne({ email })
      .exec()
      .then((doc) => {
        resolve(doc);
      })
      .catch((err) => {
        reject(err);
      });;
      
    } catch (error) {
      reject(error);
    }
  });
};



module.exports = { findUser };
