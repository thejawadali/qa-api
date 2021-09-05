import { Router } from "express"
import "express-async-errors"
import { body, param } from "express-validator"
import { toLower } from "lodash"
import { validationErrorChecker } from "../core/error-handler"
import answerModel from "./answer.model"

require("dotenv").config()

const router = Router()

router.get(
  "/:answerId",
  [
    param("answerId").exists().isMongoId()
  ],
  validationErrorChecker,
  async (req, res) => {
    const answer = await answerModel.findOne({
      _id: req.params.answerId
    })

    if (!answer) {
      return res.status(400).send("Answer Not Found")
    }
    res.status(200).json(answer)
  }
)

export default router
