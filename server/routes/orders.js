const express = require("express")
const router = express.Router()
const { authenticateUser, authorizeUser } = require("../middleware/authentication")
const { getOrders, createOrder, getOrder, updateOrder, showOrders } = require("../controllers/orders_v2")

router.route("/").get(authorizeUser("admin"), getOrders).post(createOrder)
router.route("/me").get(showOrders)
router.route("/:id").get(getOrder).patch(updateOrder)
module.exports = router
