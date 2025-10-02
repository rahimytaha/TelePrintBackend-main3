/** @format */

const mongoose = require("mongoose")

const Button_RecordSchema = new mongoose.Schema(
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

    finalPrice: {
      type: Number
    },
    priceWithOutTax: {
      type: Number
    },
    Tax: {
      type: Number
    },
    description: {
      type: String,
      default: ""
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

module.exports = mongoose.model("Button_Record", Button_RecordSchema)
