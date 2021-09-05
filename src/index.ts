import express from 'express'
import mongoose from "mongoose"
import cors from "cors";
import { json } from "body-parser"
import userInit from "./user/user.init"
import authController from "./user/auth.controller";
import tagController from "./tag/tag.controller";
import questionController from "./question/question.controller";
import answerController from "./answer/answer.controller";
import tagInit from "./tag/tag.init"
import questionInit from "./question/question.init"
import answerInit from "./answer/answer.init"
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
  app.use(cors())
  app.use("/uploads", express.static("uploads"))
  app.use(json())
  userInit()
  tagInit()
  questionInit()
  answerInit()

  app.use("/auth", authController)
  app.use("/tag", tagController)
  app.use("/question", questionController)
  app.use("/answer", answerController)
  const port = 3000
  app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`)
  })
})
