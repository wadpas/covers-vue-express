const express = require("express")
const router = express.Router()
const { authenticateUser, authorizeUser } = require("../middleware/authentication")
const { getComments, createComment, getComment, updateComment, deleteComment } = require("../controllers/comments_v2")

router.route("/").get(getComments).post(authenticateUser, createComment)
router.route("/:id").get(getComment).patch(authenticateUser, updateComment).delete(authenticateUser, deleteComment)

module.exports = router
