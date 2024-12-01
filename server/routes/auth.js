const express = require("express")
const authentication = require("../middleware/authentication")
const router = express.Router()

const { login, register, logout, updateUser } = require("../controllers/auth_v2")

router.post("/register", register)
router.post("/login", login)
router.patch("/updateUser", updateUser)
router.get("/logout", logout)

module.exports = router
