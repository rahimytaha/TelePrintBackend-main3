/** @format */

const mongoose = require("mongoose");

const LimitedSizeSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      trim: true
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: null
    },
    max_Width: {
      type: Number
    },
    min_Width: {
      type: Number
    },
    min_Height: {
      type: Number
    },
    max_Height: {
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

module.exports = mongoose.model("LimitedSize", LimitedSizeSchema);
