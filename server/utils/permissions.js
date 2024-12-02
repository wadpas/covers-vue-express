const { UnauthorizedError } = require("../errors")

const checkPermissions = (requestUser, resourceUser) => {
  if (requestUser.role === "admin") return
  if (requestUser._id === resourceUser._id) return
  throw new UnauthorizedError("Not authorized to access this route")
}

module.exports = checkPermissions
