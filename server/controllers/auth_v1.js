const User = require("../models/User")
const { StatusCodes } = require("http-status-codes")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { BadRequestError, UnauthenticatedError } = require("../errors")

const login = async (req, res) => {
  res.send("login user")
}

const register = async (req, res) => {
  const { username, nickname, email, password } = req.body
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)
  const tempUser = { username, nickname, email, password: hashedPassword }

  const user = await User.create({ ...tempUser })

  res.status(StatusCodes.CREATED).json({ user })
}

module.exports = {
  login,
  register,
}
