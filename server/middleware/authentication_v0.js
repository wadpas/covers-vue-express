const Token = require("../models/Token")
const jwt = require("jsonwebtoken")
const { isTokenValid } = require("../utils")
const { UnauthenticatedError, UnauthorizedError } = require("../errors")
const { attachTokensToResponse } = require("../utils")

const authenticateUser = async (req, res, next) => {
  const { refreshToken, accessToken } = req.signedCookies

  try {
    if (accessToken) {
      const user = isTokenValid(accessToken)
      req.user = user
      return next()
    }
    const user = isTokenValid(refreshToken)
    const existingToken = await Token.findOne({
      user: user.user._id,
      refreshToken: user.refreshToken,
    })

    if (!existingToken || !existingToken?.isValid) {
      throw new UnauthenticatedError("Authentication Invalid")
    }
    attachTokensToResponse({ res, user, refreshToken })
    req.user = user
    next()
  } catch (error) {
    throw new UnauthenticatedError("Authentication Invalid")
  }
}

const authorizeUser = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new UnauthorizedError("Unauthorized to access this route")
    }
    next()
  }
}

module.exports = { authenticateUser, authorizeUser }
