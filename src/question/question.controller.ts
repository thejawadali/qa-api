import { Router } from "express"
import "express-async-errors"
import { body, param } from "express-validator"
import { toLower } from "lodash"
import { authorizeByRole } from "../core/authorization"
import { validationErrorChecker } from "../core/error-handler"
import tagModel from "../tag/tag.model"
import { Roles } from "../user/user.model"
import questionModel, { IQuestion } from "./question.model"

require("dotenv").config()

const router = Router()

router.post(
  "/",
  [
    body("title").exists(),
    body("tags").exists().isArray()
  ],
  validationErrorChecker,
  authorizeByRole(Roles.User),
  async (req, res) => {
    const tags = await tagModel.find({
      _id: req.body.tags
    })
    const question = new questionModel({
      title: req.body.title,
      details: req.body.details,
      user: req.user.id,
      tags: tags.map((t) => t._id)
    })

    await question.save()
    res.status(201).json(question)
  }
)

router.get(
  "/",
  async (_req, res) => {
    const questions = await questionModel.find()
    res.status(200).json(questions)
  }
)

router.get(
  "/:questionId",
  [
    param("questionId").exists().isMongoId()
  ],
  validationErrorChecker,
  async (req, res) => {
    const question = await questionModel.findOne({
      _id: req.params.questionId
    })

    if (!question) {
      return res.status(400).send("Question not found")
    }
    question.views++
    await question.save()
    res.status(200).json(question)
  }
)

export default router
