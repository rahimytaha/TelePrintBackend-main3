/** @format */

const mongoose = require("mongoose");

const Klebe_BuchstabeSchema = new mongoose.Schema(
  {
    cost: {
      type: Number,
      default: 0,
    },
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

module.exports = mongoose.model("Klebe_Buchstabe", Klebe_BuchstabeSchema);
