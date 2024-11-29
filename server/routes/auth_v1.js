const express = require("express")
const authentication = require("../middleware/authentication")
const router = express.Router()

const { login, register, updateUser } = require("../controllers/auth_v1")

router.post("/login", login)
router.post("/register", register)
router.patch("/update", authentication, updateUser)

module.exports = router
