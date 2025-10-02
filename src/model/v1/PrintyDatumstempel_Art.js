/** @format */

const mongoose = require("mongoose");

const PrintyDatumstempel_Art = new mongoose.Schema(
  {
    key: {
      type: String,
      default: "",
    },
    productKey: {
      type: String,
      default: "",
    },
    isRound: {
      type: Boolean,
      default: false,
    },
    completePrice: {
      type: Number,
      default: 0,
    },
    platePrice: {
      type: Number,
      default: 0,
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

module.exports = mongoose.model("PrintyDatumstempel_Art", PrintyDatumstempel_Art);
