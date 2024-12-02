const jwt = require("jsonwebtoken")
const { isTokenValid } = require("../utils")
const { UnauthenticatedError, UnauthorizedError } = require("../errors")

const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token
  if (!token) {
    throw new UnauthenticatedError("Authentication Invalid")
  }
  try {
    const { user } = isTokenValid(token)
    req.user = user
    next()
  } catch (error) {
    throw new UnauthenticatedError("Authentication Invalid")
  }
}

const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new UnauthorizedError("Unauthorized to access this route")
    }
    next()
  }
}

module.exports = { authenticateUser, authorizePermissions }
