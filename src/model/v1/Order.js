/** @format */

const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    tableName: {
      type: String,
      trim: true,
    },
    tableId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "tableName",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    productName: {
      type: String,
      trim: true,
    },
    description: {
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

module.exports = mongoose.model("Order", OrderSchema);
