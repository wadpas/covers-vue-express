const { StatusCodes } = require("http-status-codes")
const User = require("../models/User")
const { BadRequestError, NotFoundError } = require("../errors")
const { attachCookiesToResponse, checkPermissions } = require("../utils")

const getUsers = async (req, res) => {
  const users = await User.find({}).select("-password")
  res.status(StatusCodes.OK).json({ users })
}

const getUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id }).select("-password")
  if (!user) {
    throw new NotFoundError(`No user with id : ${req.params.id}`)
  }
  checkPermissions(req.user, user)
  res.status(StatusCodes.OK).json({ user })
}

const showUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user })
}

const updateUser = async (req, res) => {
  const { firstName, lastName, email } = req.body
  if (!firstName || !lastName || !email) {
    throw new BadRequestError("Please provide all values")
  }
  const user = await User.findOneAndUpdate({ _id: req.user._id }, { firstName, lastName, email }, { new: true, runValidators: true }).select("-password")
  if (!user) {
    throw new NotFoundError(`No user with id : ${req.user.userId}`)
  }
  attachCookiesToResponse({ res, user })
  res.status(StatusCodes.OK).json({ user })
}

const updatePassword = async (req, res) => {
  console.log(req.user)

  const { oldPassword, newPassword } = req.body
  if (!oldPassword || !newPassword) {
    throw new BadRequestError("Please provide both values")
  }
  const user = await User.findOne({ _id: req.user._id })
  if (!user) {
    throw new NotFoundError(`No user with id : ${req.user.userId}`)
  }
  const isPasswordCorrect = await user.comparePassword(oldPassword)
  if (!isPasswordCorrect) {
    throw new BadRequestError("Invalid Credentials")
  }
  user.password = newPassword
  await user.save()
  res.status(StatusCodes.OK).json({ msg: "Success! Password Updated." })
}

module.exports = {
  getUsers,
  getUser,
  showUser,
  updateUser,
  updatePassword,
}
