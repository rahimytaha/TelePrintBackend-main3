/** @format */

const mongoose = require("mongoose");

const EndFormat_EtikettenSchema = new mongoose.Schema(
  {
    cost: {
      type: Number,
      default: 0
    },
    key: {
      type: String,
      trim: true
    },
    width: {
      type: Number
    },
    height: {
      type: Number
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
);

module.exports = mongoose.model("EndFormat_Etiketten", EndFormat_EtikettenSchema);
