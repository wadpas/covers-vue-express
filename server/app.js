require("dotenv").config()
require("express-async-errors")
const express = require("express")
const app = express()
const cors = require("cors")
const notFound = require("./middleware/not-found")
const errorHandler = require("./middleware/error-handler")

app.use(express.json())
app.use(cors())

app.get("/", (req, res) => res.send("<h1>Riverside API</h1>"))
app.use("/api/v1/books", require("./routes/books_v1"))

app.use(notFound)
app.use(errorHandler)

const connectDB = require("./db/connect")
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
