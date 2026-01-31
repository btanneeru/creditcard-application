const PanInfo = require("../models/paninfo");

exports.getPanInfoByPanNumber = (id) => {
  return new Promise((resolve, reject) => {
    let condition = { pan: id };
    PanInfo.find(condition)
      .select("-__v")
      .exec()
      .then((doc) => {
        resolve(doc[0]);
      })
      .catch((err) => {
        reject(err);
      });
  });
};