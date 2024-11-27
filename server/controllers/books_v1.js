const Book = require("../models/Book")

const getBooks = async (req, res) => {
  res.send("get books")
}

const getBook = async (req, res) => {
  res.send("get book")
}

const createBook = async (req, res) => {
  res.send("create book")
}

const updateBook = async (req, res) => {
  res.send("update book")
}

const deleteBook = async (req, res) => {
  res.send("delete book")
}

const addBooks = async (req, res) => {
  await Book.deleteMany()
  const books = await Book.insertMany(req.body)
  res.status(200).json({ books })
}

module.exports = {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  addBooks,
}
