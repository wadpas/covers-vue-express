require("dotenv").config()
require("express-async-errors")
const express = require("express")
const app = express()
const morgan = require("morgan")
const cookieParser = require("cookie-parser")
const fileUpload = require("express-fileupload")
const cors = require("cors")
const connectDB = require("./db/connect")
const cloudinary = require("cloudinary").v2
const books = require("./routes/books")
const auth = require("./routes/auth")
const notFound = require("./middleware/not-found")
const errorHandler = require("./middleware/error-handler")
const authentication = require("./middleware/authentication")

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
})

app.use(express.static("./public"))
app.use(express.json())
app.use(cors())
app.use(cookieParser(process.env.JWT_SECRET))
app.use(fileUpload({ useTempFiles: true }))
app.use(morgan("tiny"))
app.use("/api/v1/auth", auth)
app.use("/api/v1/books", authentication, books)
app.use(notFound)
app.use(errorHandler)

const port = process.env.PORT || 3000
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`)
    })
  } catch (error) {
    console.log(error)
  }
}

start()
