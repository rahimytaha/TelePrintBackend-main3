/** @format */

const mongoose = require("mongoose");

const Poster_EndFormatSchema = new mongoose.Schema(
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
  { timestamps: true }
);

module.exports = mongoose.model("Poster_EndFormat", Poster_EndFormatSchema);
