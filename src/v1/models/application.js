const mongoose = require("mongoose");
const { applications } = require("../utils/collections");

const applicationsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    status: {
      type: String,
      required: true,
      default: "submitted",
      enum: ["submitted", "in_review", "approved", "rejected"]
    },
    approvedAmount: {
      type: Number,
      required: true
    },
    creditLimit: {
      type: Number,
    },
    manualAssessmentRequired: {
      type: Boolean,
      default: false
    },
    appliedOn: {
      type: Date,
    },
    decisionAt: {
      type: Date,
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

module.exports = mongoose.model(applications.model, applicationsSchema, applications.collection);
