const mongoose = require("mongoose");
const { paninfo } = require("../utils/collections");

const paninfoSchema = new mongoose.Schema(
  {
    pan: {
      type: String,
      required: true,
    },
    creditScore: {
      type: Number,
      required: true
    },
  }
);

module.exports = mongoose.model(paninfo.model, paninfoSchema, paninfo.collection);
