/** @format */

const mongoose = require("mongoose")

const FolderEin_RecordSchema = new mongoose.Schema(
  {
    count: {
      type: Number
    },
    isRound: {
      type: Boolean,
      default: false
    },
    isComplete: {
      type: Boolean,
      default: false
    },
    pillowColorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PrintyDatumstempel_PillowColor"
    },
    art: {
      type: String,
      default: 0
    },
    finalPrice: {
      type: Number,
      default: 0
    },
    priceWithOutTax: {
      type: Number
    },
    description: {
      type: String,
      default: ""
    },
    Tax: {
      type: Number
    },
    file1: {
      type: String
    },
    file2: {
      type: String
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

module.exports = mongoose.model("PrintyDatumstempel_Record", FolderEin_RecordSchema)
