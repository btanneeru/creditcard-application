const logger = require("../../../utils/logger")

/**
 * Handles error by printing to console in development env and builds and sends an error response
 * @param {Object} res - response object
 * @param {Object} err - error object
 */
const handleError = (res = {}, err = {}) => {
  // Prints error in console
  if (process.env.ENV === "development") {
    logger.error(err);
  }
  // logger.error("caught handleError  ", err);
  // Sends error to user
  res.status(err.code ? err.code : 400).json({
    errors: {
      msg: err.message,
    },
  });
};

module.exports = { handleError };
