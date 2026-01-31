const YAML = require("yamljs");
// const v1 = YAML.load("./swagger-v1.yaml");
const user = YAML.load("./swagger-user.yaml");

// exports.v1 = (req, res, next) => {
//   v1.host = req.get("host");
//   req.swaggerDoc = v1;
//   next();
// };

exports.user = (req, res, next) => {
  user.host = req.get("host");
  req.swaggerDoc = user;
  next();
};
