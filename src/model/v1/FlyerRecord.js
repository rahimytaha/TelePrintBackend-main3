/** @format */

const mongoose = require("mongoose")

const FlyerRecordSchema = new mongoose.Schema(
  {
    count: {
      type: Number
    },
    doubleSided: {
      type: Boolean
    },
    colorful: {
      type: Boolean
    },
    isCellophane: {
      type: Boolean
    },
    cellophaneType: {
      type: String,
      default: "nein"
    },
    width: {
      type: Number
    },
    height: {
      type: Number
    },
    materialId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DigiPrint_Material"
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

module.exports = mongoose.model("FlyerRecord", FlyerRecordSchema)
