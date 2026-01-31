const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const { user } = require("../../v1/utils/collections");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      default: "User",
    },
    email: {
      type: String,
      validate: {
        validator: validator.isEmail,
        message: "EMAIL_IS_NOT_VALID",
      },
      lowercase: true,
      unique: true,
      required: true
    },
    password: {
      type: String,
      default: null,
    }
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const hash = (user, salt, next) => {
  bcrypt.hash(user.password, salt, (error, newHash) => {
    if (error) {
      return next(error);
    }
    user.password = newHash;
    return next();
  });
};

const genSalt = (user, SALT_FACTOR, next) => {
  bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
    if (err) {
      return next(err);
    }
    return hash(user, salt, next);
  });
};

UserSchema.pre("save", function (next) {
  const that = this;
  const SALT_FACTOR = 5;
  if (!that.isModified("password")) {
    return next();
  }
  return genSalt(that, SALT_FACTOR, next);
});

UserSchema.methods.comparePassword = function (passwordAttempt, cb) {
  bcrypt.compare(passwordAttempt, this.password, (err, isMatch) =>
    err ? cb(err) : cb(null, isMatch)
  );
};

module.exports = mongoose.model(
  user.model,
  UserSchema,
  user.collection
);
