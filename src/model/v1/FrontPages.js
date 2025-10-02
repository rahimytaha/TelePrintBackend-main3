const mongoose = require("mongoose")

const FrontPagesSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      trim: true
    },
    metaTitle: { type: String, required: true },
    metaDescription: { type: String, required: true },
    metaKeywords: { type: String },
    canonicalUrl: { type: String },
    content: { type: String },
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

module.exports = mongoose.model("FrontPages", FrontPagesSchema)
