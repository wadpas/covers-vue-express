require("dotenv").config()
require("express-async-errors")
const express = require("express")
const app = express()
const cors = require("cors")
const connectDB = require("./db/connect")
const books = require("./routes/books_v1")
const auth = require("./routes/auth_v1")
const notFound = require("./middleware/not-found")
const errorHandler = require("./middleware/error-handler")
const authentication = require("./middleware/authentication")

app.use(express.json())
app.use(cors())
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
