const { createJWT, isTokenValid, attachCookiesToResponse, attachTokensToResponse } = require("./jwt")
const { sendEmail, sendVerificationEmail, sendResetPasswordEmail } = require("./nodeEmail")
const authorizeById = require("./authorizeById")
const createHash = require("./hash")

module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
  attachTokensToResponse,
  sendEmail,
  sendVerificationEmail,
  sendResetPasswordEmail,
  authorizeById,
  createHash,
}
