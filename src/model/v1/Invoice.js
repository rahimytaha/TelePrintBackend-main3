/** @format */

const mongoose = require("mongoose");

const InvoiceSchema = new mongoose.Schema(
  {
    orderIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
    invoiceNumber: {
      type: String,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "User",
    },
    totalPayment: {
      type: Number,
    },
    subTotal: {
      type: Number,
    },
    tax: {
      type: Number,
    },
    customertype: {
      type: String,
      trim: true,
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    postalCode: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    street: {
      type: String,
      trim: true,
    },
    shipment: {
      type: String,
      trim: true,
      enum: ["send", "pickup"],
    },
    company: {
      type: String,
      trim: true,
    },
    industry: {
      type: String,
      trim: true,
    },
    UID_Nummer: {
      type: String,
      trim: true,
    },
    Association: {
      type: String,
      trim: true,
    },
    AssociationNumber: {
      type: String,
      trim: true,
    },
    chairman: {
      type: String,
      trim: true,
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
  { timestamps: true },
);

module.exports = mongoose.model("Invoice", InvoiceSchema);
