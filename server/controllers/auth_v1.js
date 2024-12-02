const User = require("../models/User")
const { StatusCodes } = require("http-status-codes")
const { BadRequestError, UnauthenticatedError } = require("../errors")

const register = async (req, res) => {
  const user = await User.create({ ...req.body })
  user.password = undefined
  const token = user.createJWT()
  res.status(StatusCodes.CREATED).json({ user, token })
}
const login = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    throw new BadRequestError("Please provide email and password")
  }
  const user = await User.findOne({ email })
  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials")
  }
  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials")
  }
  user.password = undefined
  const token = user.createJWT()
  res.status(StatusCodes.OK).json({ user, token })
}

const logout = async (req, res) => {
  res.send("logout user")
}

module.exports = {
  login,
  register,
  updateUser,
  logout,
}
