const { setUserInfo } = require("./setUserInfo");
const { generateToken } = require("./generateToken");

/**
 * Saves a new user access and then returns token
 * @param {Object} req - request object
 * @param {Object} user - user object
 */
const saveUserAccessAndReturnToken = (req = {}, user = {}) => {
  return new Promise(async(resolve, reject) => {
    const userInfo = await setUserInfo(user);
      resolve({
        token: await generateToken(user._id),
        user: userInfo
      });
  });
};

module.exports = { saveUserAccessAndReturnToken };
