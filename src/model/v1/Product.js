/** @format */

const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category"
    },
    key: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true
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

module.exports = mongoose.model("Product", ProductSchema);
