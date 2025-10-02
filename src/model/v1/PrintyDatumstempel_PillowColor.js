/** @format */

const mongoose = require("mongoose");

const PrintyDatumstempel_PillowColor = new mongoose.Schema(
  {
    key: {
      type: String,
      trim: true,
    },
    CMYK: {
      type: String,
      trim: true,
    },
    RGB: {
      type: String,
      trim: true,
    },
    Hex: {
      type: String,
      trim: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedBy: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("PrintyDatumstempel_PillowColor", PrintyDatumstempel_PillowColor);
