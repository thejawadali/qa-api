import tagModel from "../tag/tag.model"
import userModel from "../user/user.model"
import questionModel, { IQuestion } from "./question.model"

export default async function () {
  if (await questionModel.countDocuments() > 0) {
    return
  }
  const user = await userModel.findOne()
  if (!user) {
    console.warn("No User found")
    return
  }
  const tag = await tagModel.findOne()
  if (!tag) {
    console.warn("No Tag Found")
    return
  }
  const question = new questionModel({
    title: "How to be a successfull guy",
    details: "Deleniti fugiat ipsum iure et asperiores omnis.",
    views: 34,
    tags: tag._id,
    user: user._id
  } as IQuestion)
  await question.save()
}
