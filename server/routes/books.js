const express = require("express")
const router = express.Router()
const { getBooks, getBook, createBook, updateBook, deleteBook, addBooks, showStats, uploadImage, uploadCloudinary } = require("../controllers/books_v1")

router.route("/").get(getBooks).post(createBook).put(addBooks)
router.route("/stats").get(showStats)
router.route("/upload").post(uploadCloudinary)
router.route("/:id").get(getBook).patch(updateBook).delete(deleteBook)

module.exports = router
