const Book = require("../models/book")
const { StatusCodes } = require("http-status-codes")
const { BadRequestError, NotFoundError } = require("../errors/bad-request")

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
  let result = Book.find(queryObject)

  if (sort === "latest") {
    result = result.sort("-createdAt")
  }
  if (sort === "oldest") {
    result = result.sort("createdAt")
  }
  if (sort === "a-z") {
    result = result.sort("title")
  }
  if (sort === "z-a") {
    result = result.sort("-title")
  }

  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const skip = (page - 1) * limit
  result = result.skip(skip).limit(limit)

  const books = await result

  const totalBooks = await Book.countDocuments(queryObject)
  const numOfPages = Math.ceil(totalBooks / limit)

  res.status(StatusCodes.OK).json({ books, count: books.length })
}

const getBook = async (req, res) => {
  const { id: bookId } = req.params
  const book = await Book.findOne({ _id: bookId })
  if (!book) {
    throw new NotFoundError(`No book with id : ${bookId}`)
  }
  res.status(StatusCodes.OK).json({ book })
}

const createBook = async (req, res) => {
  req.body.createdBy = req.user.userId
  const book = await Book.create(req.body)
  res.status(StatusCodes.CREATED).json({ book })
}

const updateBook = async (req, res) => {
  const { id: bookId } = req.params
  const book = await Book.findOneAndUpdate({ _id: bookId }, req.body, {
    new: true,
    runValidators: true,
  })
  if (!book) {
    throw new NotFoundError(`No book with id : ${bookId}`)
  }
  res.status(StatusCodes.OK).json({ book })
}

const deleteBook = async (req, res) => {
  const { id: bookId } = req.params
  const book = await Book.findOneAndDelete({ _id: bookId })
  if (!book) {
    throw new NotFoundError(`No book with id : ${bookId}`)
  }
  res.status(StatusCodes.OK).json(`Remove book with id : ${bookId}`)
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
