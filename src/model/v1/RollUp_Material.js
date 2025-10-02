/** @format */

const mongoose = require("mongoose");

const RollUp_MaterialSchema = new mongoose.Schema(
  {
    slopeOneSided: {
      type: Number,
    },
    slopeTwoSided: {
      type: Number,
    },
    price: {
      type: Number,
    },
    key: {
      type: String,
    },
    isCellophane: {
      type: Boolean,
      default: false,
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

module.exports = mongoose.model("RollUp_Material", RollUp_MaterialSchema);
