const { registerUser, returnRegisterToken } = require("./helpers");
const { handleError } = require("../../../v1/middlewares/handleError");
const { findUser } = require("../../orm/user")
const _ = require("lodash");
const CODE = require("../../../v1/utils/httpResponseCode");

/**
 * Register function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const register = async (req, res) => {
  try {
    findUser(req.body.email)
      .then(async (doc) => {
          if (!_.isEmpty(doc)) {
            res.status(CODE.NOT_FOUND).json({ message: "User Already Exist!" });
          } else {
            const item = await registerUser(req);
            const response = await returnRegisterToken({_id: item._id}, item);
            res.status(201).json(response);
          }
      })
      .catch((err) => {
          res.status(CODE.INTERNAL_SERVER_ERROR).json({ error: err.message });
      });
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = { register };
