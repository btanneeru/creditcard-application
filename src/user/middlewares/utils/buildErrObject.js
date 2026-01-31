/**
 * Builds error object
 * @param {number} code - error code
 * @param {string} message - error text
 */
const buildErrObject = (code = '', message = '') => {
  let error = new Error(message);
  error.code = code;
  return error;
}

module.exports = { buildErrObject }
