const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide a username"],
    maxlength: [20, "Name can not be more than 20 characters"],
    minlength: [3, "Name can not be less than 3 characters"],
    trim: true,
  },
  nickname: {
    type: String,
    required: [true, "Please provide a nickname"],
    maxlength: [20, "Name can not be more than 20 characters"],
    minlength: [3, "Name can not be less than 3 characters"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    maxlength: [50, "Email can not be more than 50 characters"],
    minlength: [3, "Email can not be less than 3 characters"],
    match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "Please provide a valid email"],
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: [3, "Password can not be less than 3 characters"],
    trim: true,
  },
})

UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.createJWT = function () {
  return jwt.sign({ userId: this._id, username: this.username, nickname: this.nickname }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME })
}

UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password)
  return isMatch
}

module.exports = mongoose.model("User", UserSchema)
