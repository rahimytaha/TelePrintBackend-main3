const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema(
  {
    tableName: {
      type: String,
      trim: true,
      default: "",
    },
    tableId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "tableName",
      default: null,
    },
    url: {
      type: String,
      trim: true,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedBy: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Image", ImageSchema);
