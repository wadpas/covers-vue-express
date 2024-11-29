const Book = require("../models/book")

const getBooks = async (req, res) => {
  const { title, author, genre, year, sort, fields, numericFilters } = req.query
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
  if (sort) {
    const sortList = sort.split(",").join(" ")
    result = result.sort(sortList)
  } else {
    result = result.sort("createdAt")
  }
  if (fields) {
    const fieldsList = fields.split(",").join(" ")
    result = result.select(fieldsList)
  }

  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const skip = (page - 1) * limit
  result = result.skip(skip).limit(limit)

  const books = await result
  res.status(200).json({ books, nbHits: books.length })
}

module.exports = {
  getBooks,
  addBooks,
}
