/** @format */

const mongoose = require("mongoose");

const Button_EndFormatSchema = new mongoose.Schema(
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

module.exports = mongoose.model("Button_EndFormat", Button_EndFormatSchema);
