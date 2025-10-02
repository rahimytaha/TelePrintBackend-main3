/** @format */

const mongoose = require("mongoose");

const Poster_MaterialSchema = new mongoose.Schema(
  {
    price: {
      type: Number,
    },
    key: {
      type: String,
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
  { timestamps: true }
);

module.exports = mongoose.model("Poster_Material", Poster_MaterialSchema);
