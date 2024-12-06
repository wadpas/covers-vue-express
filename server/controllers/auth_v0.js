const crypto = require("crypto")
const User = require("../models/User")
const Token = require("../models/Token")
const { StatusCodes } = require("http-status-codes")
const { BadRequestError, UnauthenticatedError } = require("../errors")
const { attachTokensToResponse, sendVerificationEmail, sendResetPasswordEmail, createHash } = require("../utils")
const origin = "http://localhost:3000/api/v1"

const register = async (req, res) => {
  let user = await User.findOne({ email: req.body.email })
  if (user) {
    throw new BadRequestError("Email already exists")
  }
  req.body.role = "user"
  req.body.verificationToken = crypto.randomBytes(40).toString("hex")
  user = await User.create({ ...req.body })
  user.password = undefined
  // attachCookiesToResponse({ res, user })
  await sendVerificationEmail({
    name: user.name,
    email: user.email,
    verificationToken: user.verificationToken,
    origin,
  })
  res.status(StatusCodes.CREATED).json({
    msg: "Please check your email to verify account",
  })
}

const verifyEmail = async (req, res) => {
  const { verificationToken, email } = req.query
  const user = await User.findOne({ email })
  if (!user) {
    throw new UnauthenticatedError("Verification Failed. No User")
  }
  if (user.verificationToken !== verificationToken) {
    throw new UnauthenticatedError("Verification Failed")
  }
  user.isVerified = true
  user.verified = Date.now()
  user.verificationToken = ""
  await user.save()
  res.status(StatusCodes.OK).json({ msg: "Email Verified" })
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
  if (!user.isVerified) {
    throw new UnauthenticatedError("Please verify your email")
  }
  user.password = undefined

  let refreshToken = ""
  const existingToken = await Token.findOne({ user: user._id })
  if (existingToken) {
    const { isValid } = existingToken
    if (!isValid) {
      throw new UnauthenticatedError("Invalid Credentials")
    }
    refreshToken = existingToken.refreshToken
    attachTokensToResponse({ res, user, refreshToken })
    return res.status(StatusCodes.OK).json({ user })
  }

  refreshToken = crypto.randomBytes(40).toString("hex")
  const userAgent = req.headers["user-agent"]
  const ip = req.ip
  const userToken = { refreshToken, ip, userAgent, user: user._id }
  await Token.create(userToken)
  attachTokensToResponse({ res, user, refreshToken })
  res.status(StatusCodes.OK).json({ user })
}

const logout = async (req, res) => {
  await Token.findOneAndDelete({ user: req.user.userId })

  res.cookie("accessToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  })
  res.cookie("refreshToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  })
  res.status(StatusCodes.OK).json({ msg: "user logged out!" })
}

const forgotPassword = async (req, res) => {
  const { email } = req.body
  if (!email) {
    throw new BadRequestError("Please provide valid email")
  }
  const user = await User.findOne({ email })
  if (user) {
    const passwordToken = crypto.randomBytes(70).toString("hex")

    await sendResetPasswordEmail({
      name: user.name,
      email: user.email,
      token: passwordToken,
      origin,
    })

    const tenMinutes = 1000 * 60 * 10
    const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes)
    user.passwordToken = createHash(passwordToken)
    user.passwordTokenExpirationDate = passwordTokenExpirationDate
    await user.save()
  }
  res.status(StatusCodes.OK).json({ msg: "Please check your email for reset password link" })
}

const resetPassword = async (req, res) => {
  const { token, email, password } = req.body
  if (!token || !email || !password) {
    throw new BadRequestError("Please provide all values")
  }
  const user = await User.findOne({ email })
  if (user) {
    const currentDate = new Date()
    if (user.passwordToken === createHash(token) && user.passwordTokenExpirationDate > currentDate) {
      user.password = password
      user.passwordToken = null
      user.passwordTokenExpirationDate = null
      await user.save()
    }
  }
  res.status(StatusCodes.OK).json({ msg: "Reset Password" })
}

module.exports = {
  register,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
}
