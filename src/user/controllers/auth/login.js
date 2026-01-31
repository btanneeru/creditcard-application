const {
  passwordsDoNotMatch,
  saveUserAccessAndReturnToken,
} = require("./helpers");
const User = require("../../model/user");
const { handleError } = require("../../../v1/middlewares/handleError");
const { checkPassword } = require("../../middlewares/auth/checkPassword");
const _ = require("lodash");
const CODE = require("../../../v1/utils/httpResponseCode");
const { findUser } = require("../../orm/user")

/**
 * Login function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const login = async (req, res) => {
  try {
    findUser(req.body.email)
      .then(async (doc) => {
          if (!_.isEmpty(doc)) {
            const isPasswordMatch = await checkPassword(req.body.password, doc);
            if (!isPasswordMatch) {
              handleError(res, await passwordsDoNotMatch(doc));
            } else {
              const response = await saveUserAccessAndReturnToken(req, doc);
              res.status(200).json(response);
            }
          } else {
              res.status(CODE.NOT_FOUND).json({ message: "User Does not Exist!" });
          }
      })
      .catch((err) => {
          res.status(CODE.INTERNAL_SERVER_ERROR).json({ error: err.message });
      });
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = { login };
