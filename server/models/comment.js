const mongoose = require("mongoose")

const CommentSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1.0,
      max: 5.0,
      required: [true, "Please provide a rating"],
    },
    text: {
      type: String,
      required: [true, "Please provide a text"],
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

CommentSchema.index({ createdOn: 1, createdBy: 1 }, { unique: true })

CommentSchema.statics.calculateAverageRating = async function (createdOn) {
  const result = await this.aggregate([
    {
      $match: { createdOn: createdOn },
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        numOfComments: { $sum: 1 },
      },
    },
  ])
  try {
    await this.model("Book").findOneAndUpdate(
      { _id: createdOn },
      {
        averageRating: Math.round(result[0]?.averageRating * 10 || 0) / 10,
        numOfComments: result[0]?.numOfComments || 0,
      }
    )
  } catch (error) {
    console.log(error)
  }
}

CommentSchema.post("save", async function () {
  await this.constructor.calculateAverageRating(this.createdOn)
})

CommentSchema.post("remove", async function () {
  await this.constructor.calculateAverageRating(this.createdOn)
})

module.exports = mongoose.model("Comment", CommentSchema)
