import express from 'express'
import mongoose from "mongoose"
import { json } from "body-parser"
require("dotenv").config()

const dbName = "blogs"
const mongoURI = `mongodb://localhost:27017/${dbName}`
const app = express()

const db = mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})


db.then(() => {
  console.log("db connected")
  app.use("/uploads", express.static("uploads"))
  app.use(json())

  app.get("/", (req, res) => {
    res.send("asdfjk")
  })

  const port = 3000
  app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`)
  })
})
