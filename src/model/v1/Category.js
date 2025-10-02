const mongoose = require("mongoose")

const CategorySchema = new mongoose.Schema(
  {
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null
    },
    key: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    du_name: {
      type: String,
      trim: true
    },
    en_name: {
      type: String,
      trim: true
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

module.exports = mongoose.model("Category", CategorySchema)
