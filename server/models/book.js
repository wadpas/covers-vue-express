const mongoose = require("mongoose")

const BookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      maxlength: [200, "Title can not be more than 120 characters"],
      minlength: [3, "Title can not be less than 3 characters"],
      trim: true,
      unique: true,
    },
    author: {
      type: String,
      required: [true, "Please provide an author"],
      maxlength: [200, "Author can not be more than 120 characters"],
      minlength: [3, "Author can not be less than 3 characters"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
      maxlength: [1000, "Description can not be more than 1000 characters"],
      minlength: [30, "Description can not be less than 3 characters"],
      trim: true,
    },
    genre: {
      type: [String],
      required: [true, "Please provide a genre"],
      maxlength: [200, "Image can not be more than 120 characters"],
      minlength: [3, "Image can not be less than 3 characters"],
      trim: true,
    },
    year: {
      type: Number,
      required: [true, "Please provide a year"],
      maxlength: [4, "Year can not be more than 4 characters"],
      minlength: [4, "Year can not be less than 4 characters"],
      trim: true,
    },
    cover: {
      type: String,
      required: [true, "Please provide an cover"],
      maxlength: [200, "Cover can not be more than 120 characters"],
      minlength: [3, "Cover can not be less than 3 characters"],
      trim: true,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a user"],
      default: "67481a99c5a2fda0ac9d0302",
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model("Book", BookSchema)
