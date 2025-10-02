/** @format */

const mongoose = require("mongoose")

const PackageSchema = new mongoose.Schema(
  {
    count: {
      type: Number
    },

    finalPrice: {
      type: Number
    },

    file1: {
      type: String
    },
    file2: {
      type: String
    },
    description: {
      type: String,
      default: ""
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
    deletedBy: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model("Package", PackageSchema)
