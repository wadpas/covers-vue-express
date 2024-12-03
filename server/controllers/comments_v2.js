const Comments = require("../models/comment")
const Books = require("../models/book")
const { StatusCodes } = require("http-status-codes")
const { BadRequestError, NotFoundError } = require("../errors")
const { checkPermissions } = require("../utils")

const getComments = async (req, res) => {
  const comments = await Comments.find({}).sort("createdAt")
  res.status(StatusCodes.OK).json({ comments, count: comments.length })
}

const createComment = async (req, res) => {
  const { createdOn: bookId } = req.body
  req.body.createdBy = req.user._id
  const book = await Books.findOne({ _id: bookId })
  if (!book) {
    throw new NotFoundError(`No book with id ${bookId}`)
  }
  let comment = await Comments.findOne({
    createdOn: bookId,
    createdBy: req.user._id,
  })
  if (comment) {
    throw new BadRequestError(`You have already commented on this book`)
  }
  comment = await Comments.create(req.body)
  res.status(StatusCodes.CREATED).json({ comment })
}

const getComment = async (req, res) => {
  const { id: commentId } = req.params
  const comment = await Comments.findOne({ _id: commentId })
  if (!comment) {
    throw new NotFoundError(`No comment with id ${commentId}`)
  }
  res.status(StatusCodes.OK).json({ comment })
}

const updateComment = async (req, res) => {
  const { id: commentId } = req.params
  const { rating, text } = req.body
  const comment = await Comments.findOne({ _id: commentId })
  if (!comment) {
    throw new NotFoundError(`No comment with id ${commentId}`)
  }
  checkPermissions(req.user, comment.createdBy)
  comment.rating = rating
  comment.text = text
  await comment.save()
  res.status(StatusCodes.OK).json({ comment })
}

const deleteComment = async (req, res) => {
  const { id: commentId } = req.params
  const comment = await Comments.findOneAndDelete({ _id: commentId })
  if (!comment) {
    throw new NotFoundError(`No comment with id ${commentId}`)
  }
  checkPermissions(req.user, comment.createdBy)
  await comment.remove()
  res.status(StatusCodes.OK).json({ msg: "Success! Comment removed" })
}

module.exports = {
  getComments,
  createComment,
  getComment,
  updateComment,
  deleteComment,
}
