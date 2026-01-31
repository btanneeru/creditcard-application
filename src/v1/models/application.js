const mongoose = require("mongoose");
const { applications } = require("../utils/collections");

const applicationsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    completed: {
      type: Boolean,
      default: false
    },
    created_on: {
      type: Date,
    },
    modified_on: {
      type: Date,
    },
  },
  {
    timestamps: { createdAt: "created_on", updatedAt: "modified_on" },
  }
);

module.exports = mongoose.model(applications.model, applicationsSchema, applications.collection);
