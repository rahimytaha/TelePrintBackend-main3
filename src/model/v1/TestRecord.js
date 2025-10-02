/** @format */

const mongoose = require("mongoose");

const TestRecordSchema = new mongoose.Schema(
  {
    finalPrice: {
      type: Number,
      default: 1,
    },

    phoneNumber: {
      type: String,
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

module.exports = mongoose.model("TestRecord", TestRecordSchema);
