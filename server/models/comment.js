const mongoose = require("mongoose")

const CommentSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "Please provide a rating"],
    },
    text: {
      type: String,
      required: [true, "Please provide a comment"],
      maxlength: [1000, "Comment text can not be more than 1000 characters"],
      minlength: [30, "Comment text can not be less than 30 characters"],
      trim: true,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdOn: {
      type: mongoose.Types.ObjectId,
      ref: "Book",
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

CommentSchema.index({ book: 1, user: 1 }, { unique: true })

module.exports = mongoose.model("Comment", CommentSchema)
