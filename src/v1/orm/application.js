const Applications = require("../models/application");

exports.getAllApplications = (query, limit, page, sort) => {
  return new Promise((resolve, reject) => {
    Applications.find(query)
      .sort(sort)
      .skip(limit * page - limit)
      .limit(limit)
      .exec()
      .then((docs) => {
        Applications.countDocuments(query)
          .then((totalCount) => {
            resolve({ docs: docs, totalCount: totalCount });
          })
          .catch((err) => {
            reject(err);
          });
      })
      .catch((err) => {
        reject(err);
      });
  });
};

exports.addApplication = (data) => {
  return new Promise((resolve, reject) => {
    const application = new Applications({ ...data });
    application
      .save()
      .then((doc) => {
        resolve(doc);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

exports.getApplicationById = (id) => {
  return new Promise((resolve, reject) => {
    let condition = { _id: id };
    Applications.find(condition)
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

exports.updateApplication = (id, data) => {
  return new Promise((resolve, reject) => {
    Applications.updateOne({ _id: id }, { $set: data }, { new: true })
      .exec()
      .then((doc) => {
        resolve(doc);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

exports.deleteApplicationById = (id) => {
  return new Promise((resolve, reject) => {
    let condition = { _id: id };
    Applications.deleteOne(condition)
      .exec()
      .then((doc) => {
        resolve(doc);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
