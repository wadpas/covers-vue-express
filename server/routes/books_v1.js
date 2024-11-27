const express = require("express")
const router = express.Router()
const { getBooks, getBook, createBook, updateBook, deleteBook, addBooks } = require("../controllers/books_v1")

router.route("/").get(getBooks).post(createBook).put(addBooks)
router.route("/:id").get(getBook).patch(updateBook).delete(deleteBook)

module.exports = router
