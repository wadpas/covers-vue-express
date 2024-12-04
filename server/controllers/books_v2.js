const Book = require("../models/book")
const { StatusCodes } = require("http-status-codes")
const { BadRequestError, NotFoundError } = require("../errors")

const getBooks = async (req, res) => {
  const books = await Book.find({}).sort("createdAt")
  res.status(StatusCodes.OK).json({ books, count: books.length })
}

const createBook = async (req, res) => {
  req.body.createdBy = req.user._id
  const book = await Book.create(req.body)
  res.status(StatusCodes.CREATED).json({ book })
}

const getBook = async (req, res) => {
  const { id: bookId } = req.params
  const book = await Book.findOne({ _id: bookId }).populate("comments")
  if (!book) {
    throw new NotFoundError(`No book with id : ${bookId}`)
  }
  res.status(StatusCodes.OK).json({ book })
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
  const book = await Book.findOne({ _id: bookId })
  if (!book) {
    throw new NotFoundError(`No book with id : ${bookId}`)
  }
  await book.remove()
  res.status(StatusCodes.OK).json({ msg: "Success! Book removed." })
}

const uploadCover = async (req, res) => {
  if (!req.files) {
    throw new BadRequestError("No File Uploaded")
  }
  let bookCover = req.files.image

  if (!bookCover.mimetype.startsWith("image")) {
    throw new BadRequestError("Please Upload Image")
  }
  const maxSize = 1024 * 1024
  if (bookCover.size > maxSize) {
    throw new BadRequestError("Please upload image smaller 1MB")
  }
  const imagePath = path.join(__dirname, "../public/uploads/" + `${bookCover.name}`)
  await bookCover.mv(imagePath)
  res.status(StatusCodes.OK).json({ cover: `/uploads/${bookCover.name}` })
}

module.exports = {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  uploadCover,
}
