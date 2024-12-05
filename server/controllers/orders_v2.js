const Book = require("../models/book")
const Order = require("../models/order")
const { authorizeById } = require("../utils")
const { StatusCodes } = require("http-status-codes")
const { BadRequestError, NotFoundError } = require("../errors")
const fakeStripeAPI = async ({ amount, currency }) => {
  const client_secret = "someRandomValue"
  return { client_secret, amount }
}

const createOrder = async (req, res) => {
  const { cartItems, tax, shippingFee } = req.body
  if (!cartItems || cartItems.length < 1) {
    throw new BadRequestError("No cart items provided")
  }
  if (!tax || !shippingFee) {
    throw new BadRequestError("Please provide tax and shipping fee")
  }
  let orderItems = []
  let subtotal = 0

  for (const item of cartItems) {
    const dbBook = await Book.findOne({ _id: item.bookId })
    if (!dbBook) {
      throw new NotFoundError(`No book with id : ${item.book}`)
    }
    const singleOrderItem = {
      title: dbBook.title,
      cover: dbBook.cover,
      price: 1.5,
      amount: item.amount,
      bookId: dbBook._id,
    }
    orderItems = [...orderItems, singleOrderItem]
    subtotal += item.amount * singleOrderItem.price
  }
  const total = tax + shippingFee + subtotal
  const paymentIntent = await fakeStripeAPI({
    amount: total,
    currency: "usd",
  })
  const order = await Order.create({
    orderItems,
    total,
    subtotal,
    tax,
    shippingFee,
    clientSecret: paymentIntent.client_secret,
    userId: req.user._id,
  })

  res.status(StatusCodes.CREATED).json({ order, clientSecret: order.clientSecret })
}

const getOrders = async (req, res) => {
  const orders = await Order.find({})
  res.status(StatusCodes.OK).json({ orders, count: orders.length })
}

const showOrders = async (req, res) => {
  const orders = await Order.find({ userId: req.user._id })
  res.status(StatusCodes.OK).json({ orders, count: orders.length })
}

const getOrder = async (req, res) => {
  const { id: orderId } = req.params
  const order = await Order.findOne({ _id: orderId })
  if (!order) {
    throw new NotFoundError(`No order with id ${orderId}`)
  }
  authorizeById(req.user, order.userId)
  res.status(StatusCodes.OK).json({ order })
}

const updateOrder = async (req, res) => {
  const { id: orderId } = req.params
  const { paymentIntentId } = req.body

  const order = await Order.findOne({ _id: orderId })
  if (!order) {
    throw new NotFoundError(`No order with id ${orderId}`)
  }
  authorizeById(req.user, order.userId)
  order.paymentIntentId = paymentIntentId
  order.status = "paid"
  await order.save()
  res.status(StatusCodes.OK).json({ order })
}

module.exports = {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  showOrders,
}
