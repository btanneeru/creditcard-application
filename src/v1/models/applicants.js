const mongoose = require("mongoose");
const { applicants } = require("../utils/collections");

const applicantsSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true
    },
    dob: {
      type: String,
      required: true
    },
    pan: {
      type: String,
      required: true
    },
    mobile: {
      type: Number,
      required: true
    },
    annualIncome: {
      type: Number,
      required: true
    },
    address: {
      type: String,
      default: null
    },
    createdAt: {
      type: Date,
    },
    updatedAt: {
      type: Date,
    },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

module.exports = mongoose.model(applicants.model, applicantsSchema, applicants.collection);
