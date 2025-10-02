/** @format */

const mongoose = require("mongoose")

const BlogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String },
    metaTitle: { type: String },
    metaDescription: { type: String },
    coverImageUrl: { type: String },
    sort: { type: Number },
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

module.exports = mongoose.model("BlogPost", BlogPostSchema)
