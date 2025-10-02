const mongoose = require("mongoose")

const AdminSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: true
    },
    lastName: {
      type: String,
      trim: true,
      required: true
    },
    userName: {
      type: String,
      require: true,
      minlength: 4,
      required: true
    },
    password: {
      type: String,
      trim: true,
      require: true,
      minlength: 6,
      required: true
    },
    isSuperUser: {
      type: Boolean,
      default: false
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

module.exports = mongoose.model("Admin", AdminSchema)
