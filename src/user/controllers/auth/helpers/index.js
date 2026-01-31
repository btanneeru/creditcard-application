const { generateToken } = require("./generateToken");
const { getUserIdFromToken } = require("./getUserIdFromToken");
const { passwordsDoNotMatch } = require("./passwordsDoNotMatch");
const { registerUser } = require("./registerUser");
const { returnRegisterToken } = require("./returnRegisterToken");
const { saveUserAccessAndReturnToken } = require("./saveUserAccessAndReturnToken");

module.exports = {
  saveUserAccessAndReturnToken,
  generateToken,
  getUserIdFromToken,
  passwordsDoNotMatch,
  registerUser,
  returnRegisterToken
};
