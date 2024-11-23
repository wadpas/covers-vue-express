const mongoose = require("mongoose")

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      trim: true,
      maxlength: [120, "Title can not be more than 120 characters"],
    },
    author: {
      type: String,
      required: [true, "Please provide an author"],
      trim: true,
      maxlength: [120, "Author can not be more than 120 characters"],
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
      trim: true,
      maxlength: [1000, "Description can not be more than 1000 characters"],
    },
    genre: {
      type: [String],
      required: [true, "Please provide a genre"],
      trim: true,
      maxlength: [120, "Image can not be more than 120 characters"],
    },
    year: {
      type: Number,
      required: [true, "Please provide a year"],
      trim: true,
      maxlength: [4, "Year can not be more than 4 characters"],
    },
    cover: {
      type: String,
      required: [true, "Please provide an cover"],
      trim: true,
      maxlength: [120, "Cover can not be more than 120 characters"],
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model("Book", bookSchema)
