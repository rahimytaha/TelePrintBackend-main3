/** @format */

const mongoose = require("mongoose")

const Brochure_MaterialSchema = new mongoose.Schema(
  {
    slopeOneSided: {
      type: Number
    },
    slopeTwoSided: {
      type: Number
    },
    price: {
      type: Number
    },
    max: {
      type: Number
    },
    key: {
      type: String
    },
    isCellophane: {
      type: Boolean,
      default: false
    },
    sort: {
      type: Number
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

module.exports = mongoose.model("Brochure_Material", Brochure_MaterialSchema)
