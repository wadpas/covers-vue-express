const cloudinary = require("cloudinary").v2
const fs = require("fs")
const path = require("path")
const mongoose = require("mongoose")
const moment = require("moment")
const Book = require("../models/book")
const { StatusCodes } = require("http-status-codes")
const { NotFoundError, BadRequestError } = require("../errors/index")

const getBooks = async (req, res) => {
  const { title, author, genre, year, sort, numericFilters } = req.query
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
  if (numericFilters) {
    const operatorMap = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$eq",
      "<": "$lt",
      "<=": "$lte",
    }
    const regEx = /\b(<|>|>=|=|<|<=)\b/g
    let filters = numericFilters.replace(regEx, (match) => `-${operatorMap[match]}-`)

    const options = ["year"]
    filters = filters.split(",").forEach((item) => {
      const [field, operator, value] = item.split("-")
      console.log(field, operator, value)
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) }
      }
    })
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

const createBook = async (req, res) => {
  req.body.createdBy = req.user._id
  const book = await Book.create(req.body)
  res.status(StatusCodes.CREATED).json({ book })
}

const getBook = async (req, res) => {
  const { id: bookId } = req.params
  const book = await Book.findOne({ _id: bookId })
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

const showStats = async (req, res) => {
  let stats = await Book.aggregate([
    {
      $match: { createdBy: new mongoose.Types.ObjectId(req.user._id) },
    },
    { $group: { _id: "$year", count: { $sum: 1 } } },
  ])

  stats = stats.reduce((acc, curr) => {
    acc[curr._id] = curr.count
    return acc
  }, {})

  let defaultStats = {
    2018: stats["2018"] || 0,
    2019: stats["2019"] || 0,
    2020: stats["2020"] || 0,
    2021: stats["2021"] || 0,
    2022: stats["2022"] || 0,
    2023: stats["2023"] || 0,
    2024: stats["2024"] || 0,
  }

  let monthlyApplications = await Book.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user._id) } },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } },
    { $limit: 6 },
  ])

  monthlyApplications = monthlyApplications
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item
      const date = moment()
        .month(month - 1)
        .year(year)
        .format("MMM Y")
      return { date, count }
    })
    .reverse()

  res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications })
}

const uploadImage = async (req, res) => {
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
  return res.status(StatusCodes.OK).json({ image: { src: `/uploads/${bookCover.name}` } })
}

const uploadCloudinary = async (req, res) => {
  const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
    use_filename: true,
    folder: "file-upload",
  })
  console.log(result)

  fs.unlinkSync(req.files.image.tempFilePath)
  return res.status(StatusCodes.OK).json({ image: { src: result.secure_url } })
}

module.exports = {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  addBooks,
  showStats,
  uploadImage,
  uploadCloudinary,
}
