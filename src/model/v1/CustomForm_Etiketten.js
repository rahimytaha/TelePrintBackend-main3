/** @format */

const mongoose = require("mongoose");

const CustomFormSchema = new mongoose.Schema(
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

module.exports = mongoose.model("CustomForm_Etiketten", CustomFormSchema);
