const Book = require("../models/book")

const getBooks = async (req, res) => {
  const { title, author, genre, year } = req.query
  const queryObject = {}
  if (title) {
    queryObject.title = { $regex: title, $options: "i" }
  }
  if (author) {
    queryObject.author = { $regex: author, $options: "i" }
  }
  if (genre) {
    queryObject.genre = { $regex: genre, $options: "i" }
  }
  if (year) {
    queryObject.year = year
  }
  const books = await Book.find(queryObject)
  res.status(200).json({ books, nbHits: books.length })
}

const addBooks = async (req, res) => {
  await Book.deleteMany()
  const books = await Book.insertMany(req.body)
  res.status(200).json({ books })
}

module.exports = {
  getBooks,
  addBooks,
}
