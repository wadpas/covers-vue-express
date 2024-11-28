const Book = require("../models/Book")
const { StatusCodes } = require("http-status-codes")
const { BadRequestError, NotFoundError } = require("../errors/bad-request")

const getBooks = async (req, res) => {
  const books = await Book.find({}).sort("createdAt")
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
  res.status(StatusCodes.OK).json({ book })
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
