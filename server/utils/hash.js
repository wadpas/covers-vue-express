const crypto = require("crypto")

const createHash = (string) => {
  return crypto.createHash("sha256").update(string).digest("hex")
}

module.exports = {
  createHash,
}
