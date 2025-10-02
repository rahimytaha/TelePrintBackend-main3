/** @format */

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
    },
    isConfirmed: {
      type: Boolean,
      default: false,
    },
    code: {
      type: Number,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("UserCode", UserSchema);
