const Book = require("../models/book")

const getBooks = async (req, res) => {
  const { title, author, genre, year, sort } = req.query
  const queryObject = {}
  if (title) {
    queryObject.title = { $regex: title, $options: "i" }
  }
  if (author) {
    queryObject.author = { $regex: author, $options: "i" }
  }
  if (genre) {
    queryObject.genre = genre
  }
  if (year) {
    queryObject.year = year
  }
  console.log(queryObject)
  let result = Book.find(queryObject)
  if (sort) {
    const sortList = sort.split(",").join(" ")
    result = result.sort(sortList)
  } else {
    result = result.sort("createdAt")
  }
  const books = await result
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
