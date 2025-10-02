/** @format */

const mongoose = require("mongoose")

const CartSchema = new mongoose.Schema(
  {
    orderItems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order"
      }
    ],

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    description: {
      type: String,
      trim: true
    },

    paymentType: {
      type: String,
      trim: true,
      default: ""
    },

    statusId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrderStatus"
    },

    shipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ConstantShipment"
    },

    shippingAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address"
    },
    billingAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address"
    },
    invoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice"
    },
    finalPrice: {
      type: Number
    },
    shippingPrice: {
      type: Number
    },
    priceWithOutTax: {
      type: Number
    },
    Tax: {
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

module.exports = mongoose.model("Cart", CartSchema)
