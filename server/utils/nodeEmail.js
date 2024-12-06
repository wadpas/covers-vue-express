const nodemailer = require("nodemailer")
const nodemailerConfig = {
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
    user: "estevan83@ethereal.email",
    pass: "huyjazYbd6cX7raqrw",
  },
}

const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport(nodemailerConfig)

  return transporter.sendMail({
    from: '"Вадим Пасічник" <books@gmail.com>',
    to,
    subject,
    html,
  })
}

const sendVerificationEmail = ({ name, email, verificationToken, origin }) => {
  const verifyEmail = `${origin}/auth/verify-email?verificationToken=${verificationToken}&email=${email}`

  const message = `<p>Please confirm your email by clicking on the following link : 
  <a href="${verifyEmail}">Verify Email</a> </p>`

  return sendEmail({
    to: email,
    subject: "Email Confirmation",
    html: `<h4>Hello, ${name}</h4>
    ${message}
    `,
  })
}

const sendResetPasswordEmail = async ({ name, email, token, origin }) => {
  const resetUrl = `${origin}/auth/reset-password?token=${token}&email=${email}`
  const message = `<p>Please reset password by clicking on the following link :  <a href="${resetUrl}">Reset Password</a></p>`

  return sendEmail({
    to: email,
    subject: "Reset Password",
    html: `<h4>Hello, ${name}</h4>
    ${message}
    `,
  })
}

module.exports = {
  sendEmail,
  sendVerificationEmail,
  sendResetPasswordEmail,
}
