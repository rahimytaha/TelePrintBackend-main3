/** @format */

const mongoose = require("mongoose");

const Flyer_EndFormatSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      trim: true,
    },
    width: {
      type: Number,
    },
    height: {
      type: Number,
    },
    sort: {
      type: Number,
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

module.exports = mongoose.model("Flyer_EndFormat", Flyer_EndFormatSchema);
