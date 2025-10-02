/** @format */

const mongoose = require("mongoose")

const Schema = new mongoose.Schema(
  {
    du_name: {
      type: String,
      trim: true
    },
    en_name: {
      type: String,
      trim: true
    },
    key: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    emailContent: {
      type: String,
      trim: true,
      default: ""
    },
    sendEmail: {
      type: Boolean,
      default: false
    },
    sort: {
      type: Number
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
    deletedBy: {
      type: String,
      default: null
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model("OrderStatus", Schema)
