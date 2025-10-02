/** @format */

const mongoose = require("mongoose")

const OrderSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
    },
    client_secret: {
      type: String,
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    cartId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
    },
    sessionId: {
      type: String,
      trim: true,
    },
    paymentIntentId: {
      type: String,
      trim: true,
    },
    statusCode: {
      type: Number,
      trim: true,
      default: 0,
      enum: [200, 0, 400, 500],
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
)

module.exports = mongoose.model("Payment", OrderSchema)
