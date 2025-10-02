/** @format */

const mongoose = require("mongoose");

const Material_EtikettenSchema = new mongoose.Schema(
  {
    cost: {
      type: Number,
      default: 0
    },
    key: {
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

module.exports = mongoose.model("Material_Etiketten", Material_EtikettenSchema);
