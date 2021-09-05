import express from 'express'
import mongoose from "mongoose"
import { json } from "body-parser"
import userInit from "./user/user.init"
import authController from "./user/auth.controller";
import tagController from "./tag/tag.controller";
import tagInit from "./tag/tag.init"
require("dotenv").config()

const dbName = "qa"
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
  userInit()
  tagInit()

  app.use("/auth", authController)
  app.use("/tag", tagController)
  const port = 3000
  app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`)
  })
})
