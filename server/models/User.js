const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please provide a first name"],
      maxlength: [20, "Name can not be more than 20 characters"],
      minlength: [3, "Name can not be less than 3 characters"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Please provide a last name"],
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
      validate: {
        validator: validator.isEmail,
        message: "Please provide a valid email",
      },
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [3, "Password can not be less than 3 characters"],
      trim: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    verificationToken: String,
    isVerified: {
      type: Boolean,
      default: false,
    },
    verified: Date,
    passwordToken: {
      type: String,
    },
    passwordTokenExpirationDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
)

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password)
  return isMatch
}

module.exports = mongoose.model("User", UserSchema)
