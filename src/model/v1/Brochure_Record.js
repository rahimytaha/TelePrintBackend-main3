/** @format */

const mongoose = require("mongoose")

const Brochure_RecordSchema = new mongoose.Schema(
  {
    count: {
      type: Number
    },
    pages: {
      type: Number
    },
    doubleSided: {
      type: Boolean
    },
    kernDoubleSided: {
      type: Boolean
    },
    kernColorful: {
      type: Boolean
    },
    colorful: {
      type: Boolean
    },
    kernIsCellophane: {
      type: Boolean
    },
    kernCellophaneType: {
      type: String,
      default: "nein"
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
    description: {
      type: String,
      default: ""
    },
    materialId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DigiPrint_Material"
    },
    kernMaterialId: {
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

module.exports = mongoose.model("Brochure_Record", Brochure_RecordSchema)
