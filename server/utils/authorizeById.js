const { UnauthorizedError } = require("../errors")

const authorizeById = (requestUser, resourceUserId) => {
  if (requestUser.role === "admin") return
  if (requestUser._id === resourceUserId.toString()) return
  throw new UnauthorizedError("Not authorized to access this route")
}

module.exports = authorizeById
