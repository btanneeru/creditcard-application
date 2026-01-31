const jwt = require("jsonwebtoken");
const { encrypt } = require("../../../middlewares/auth");

/**
 * Generates a token
 * @param {Object} user - user object
 */
const generateToken = (userId) => {
  try {
    // Gets expiration time
    if (userId !== "") {
      const expiration =
        Math.floor(Date.now() / 1000) +
        60 * process.env.JWT_EXPIRATION_IN_MINUTES;

      // returns signed and encrypted token
      global.app_id = null;
      return encrypt(
        jwt.sign(
          {
            data: {
              _id: userId
            },
            exp: expiration,
          },
          process.env.JWT_S_KEY
        )
      );
    }
  } catch (error) {
    throw error;
  }
};

module.exports = { generateToken };
