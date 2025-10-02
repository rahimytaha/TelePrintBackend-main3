/** @format */

const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true
    },
    customerNumber: {
      type: String
    },
    customertype: {
      type: String,
      trim: true
    },
    firstName: {
      type: String,
      trim: true
    },
    lastName: {
      type: String,
      trim: true
    },
    postalCode: {
      type: String,
      trim: true
    },
    country: {
      type: String,
      trim: true
    },
    gender: {
      type: String,
      trim: true
    },
    company: {
      type: String,
      trim: true
    },
    industry: {
      type: String,
      trim: true
    },
    UID_Nummer: {
      type: String,
      trim: true
    },
    address: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      trim: true
    },
    Association: {
      type: String,
      trim: true
    },
    AssociationNumber: {
      type: String,
      trim: true
    },
    chairman: {
      type: String,
      trim: true
    },
    password: {
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
)

module.exports = mongoose.model("User", UserSchema)
