/** @format */

const mongoose = require("mongoose");

const support = new mongoose.Schema(
  {
    firstName: {
      type: String,
      default: "",
    },
    lastName: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    phoneNumber: {
      type: String,
      default: "",
    },
    file1: {
      type: String,
      default: "",
    },
    file2: {
      type: String,
      default: "",
    },
    product: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    count: {
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

module.exports = mongoose.model("support", support);
