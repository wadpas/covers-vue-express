const User = require("../models/User")
const { StatusCodes } = require("http-status-codes")
const { BadRequestError, UnauthenticatedError } = require("../errors")
const { createJWT, attachCookiesToResponse } = require("../utils")

const register = async (req, res) => {
  req.body.role = "user"
  const user = await User.create({ ...req.body })
  user.password = undefined
  attachCookiesToResponse({ res, user })
  res.status(StatusCodes.CREATED).json({ user })
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
  attachCookiesToResponse({ res, user })
  res.status(StatusCodes.OK).json({ user })
}

const updateUser = async (req, res) => {
  res.send("update user")
}

const logout = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  })
  res.status(StatusCodes.OK).json({ msg: "user logged out!" })
}

module.exports = {
  login,
  register,
  updateUser,
  logout,
}
