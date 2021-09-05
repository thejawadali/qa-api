import { Router } from "express"
import "express-async-errors"
import { body, param } from "express-validator"
import { toLower } from "lodash"
import { authorizeByRole } from "../core/authorization"
import { validationErrorChecker } from "../core/error-handler"
import { Roles } from "../user/user.model"
import tagModel, { ITag } from "./tag.model"

require("dotenv").config()

const router = Router()

router.post(
  "/",
  [
    body("title").exists()
  ],
  validationErrorChecker,
  authorizeByRole(Roles.User),
  async (req, res) => {
    const title = toLower(req.body.title)
    if (await tagModel.findOne({
      title
    })) {
      return res.status(400).send("Tag already exists")
    }
    const tag = new tagModel({
      title
    } as ITag)

    await tag.save()
    res.status(201).json(tag)
  }
)

router.get(
  "/",
  async (_req, res) => {
    const tags = await tagModel.find()
    res.status(200).json(tags)
  }
)

router.get(
  "/:tagId",
  [
    param("tagId").exists().isMongoId()
  ],
  validationErrorChecker,
  async (req, res) => {
    const tag = await tagModel.findOne({
      _id: req.params.tagId
    })
    if (!tag) {
      return res.status(400).send("Tag not found")
    }
    res.status(200).json(tag)
  }
)



export default router
