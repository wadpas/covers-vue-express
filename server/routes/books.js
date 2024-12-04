const express = require("express")
const router = express.Router()
const { authenticateUser, authorizeUser } = require("../middleware/authentication")
const { getBooks, getBook, createBook, updateBook, deleteBook, uploadCover } = require("../controllers/books_v2")
const { getProductComments } = require("../controllers/comments_v2")

router
  .route("/")
  .get(getBooks)
  .post([authenticateUser, authorizeUser("admin")], createBook)

router.route("/uploadCover").post([authenticateUser, authorizeUser("admin")], uploadCover)

router
  .route("/:id")
  .get(getBook)
  .patch([authenticateUser, authorizeUser("admin")], updateBook)
  .delete([authenticateUser, authorizeUser("admin")], deleteBook)

router.route("/:id/comments").get(getProductComments)
module.exports = router
