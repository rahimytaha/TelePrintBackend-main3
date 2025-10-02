/** @format */

const mongoose = require("mongoose");

const ConstantShipmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    cost: {
      type: Number,
      require: true,
    },
    du_name: {
      type: String,
      require: true,
    },
    freeAfterAmount: {
      type: Number,
    },
    icon: {
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

module.exports = mongoose.model("ConstantShipment", ConstantShipmentSchema);
