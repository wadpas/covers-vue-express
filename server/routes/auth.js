const express = require("express")
const router = express.Router()

const {
  login,
  register,
  logout,
  //  verifyEmail, forgotPassword, resetPassword
} = require("../controllers/auth_v2")

router.post("/register", register)
router.post("/login", login)
router.get("/logout", logout)
// router.get("/verify-email", verifyEmail)
// router.get("/forgot-password", forgotPassword)
// router.get("/reset-password", resetPassword)

module.exports = router
