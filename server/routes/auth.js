const express = require("express")
const router = express.Router()

const { login, register, logout } = require("../controllers/auth_v2")

router.post("/register", register)
router.post("/login", login)
router.get("/logout", logout)

module.exports = router
