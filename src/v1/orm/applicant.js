const Applicants = require("../models/applicants");

exports.getAllApplicants = (query, limit, page, sort) => {
  return new Promise((resolve, reject) => {
    Applicants.find(query)
      .sort(sort)
      .skip(limit * page - limit)
      .limit(limit)
      .exec()
      .then((docs) => {
        Applicants.countDocuments(query)
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

exports.addApplicant = (data) => {
  return new Promise((resolve, reject) => {
    const applicant = new Applicants({ ...data });
    applicant
      .save()
      .then((doc) => {
        resolve(doc);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

exports.getApplicantById = (id) => {
  return new Promise((resolve, reject) => {
    let condition = { _id: id };
    Applicants.find(condition)
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

exports.getApplicantByEmail = (email) => {
  return new Promise((resolve, reject) => {
    let condition = { email: email };
    Applicants.find(condition)
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

exports.updateApplicant = (id, data) => {
  return new Promise((resolve, reject) => {
    Applicants.updateOne({ _id: id }, { $set: data }, { new: true })
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
    Applicants.deleteOne(condition)
      .exec()
      .then((doc) => {
        resolve(doc);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
