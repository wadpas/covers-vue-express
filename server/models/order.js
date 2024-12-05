const mongoose = require("mongoose")

const SingleOrderItemSchema = mongoose.Schema({
  title: { type: String, required: true },
  cover: { type: String, required: true },
  price: { type: Number, required: true },
  amount: { type: Number, required: true },
  bookId: {
    type: mongoose.Schema.ObjectId,
    ref: "Product",
    required: true,
  },
})

const OrderSchema = mongoose.Schema(
  {
    tax: {
      type: Number,
      required: true,
    },
    shippingFee: {
      type: Number,
      required: true,
    },
    subtotal: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    orderItems: [SingleOrderItemSchema],
    status: {
      type: String,
      enum: ["pending", "failed", "paid", "delivered", "canceled"],
      default: "pending",
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    clientSecret: {
      type: String,
      required: true,
    },
    paymentIntentId: {
      type: String,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model("Order", OrderSchema)
