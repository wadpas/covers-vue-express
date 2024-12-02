const express = require("express")
const router = express.Router()
const { authorizePermissions } = require("../middleware/authentication")
const { getUsers, getUser, showUser, updateUser, updatePassword } = require("../controllers/users_v2")

router.route("/").get(authorizePermissions("admin"), getUsers)
router.route("/showMe").get(showUser)
router.route("/updateUser").patch(updateUser)
router.route("/updatePassword").patch(updatePassword)
router.route("/:id").get(getUser)

module.exports = router
