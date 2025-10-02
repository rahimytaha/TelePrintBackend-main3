/** @format */

const mongoose = require("mongoose")

const RollUp_RecordSchema = new mongoose.Schema(
  {
    count: {
      type: Number
    },
    width: {
      type: Number
    },
    height: {
      type: Number
    },
    materialId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RollUp_Material"
    },
    finalPrice: {
      type: Number
    },
    priceWithOutTax: {
      type: Number
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
    description: {
      type: String,
      default: ""
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

module.exports = mongoose.model("RollUp_Record", RollUp_RecordSchema)
