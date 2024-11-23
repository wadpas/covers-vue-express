const express = require("express")
const router = express.Router()
const { getBooks, addBooks } = require("../controllers/books_v1")

router.route("/").get(getBooks).put(addBooks)

module.exports = router
