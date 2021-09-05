import questionModel from "../question/question.model"
import userModel from "../user/user.model"
import answerModel, { IAnswer } from "./answer.model"

export default async function () {
  if (await answerModel.countDocuments() > 0) {
    return
  }
  const user = await userModel.findOne()
  if (!user) {
    console.warn("no user found")
    return
  }
  const question = await questionModel.findOne()
  if (!question) {
    console.warn("No question found")
    return
  }
  const answer = new answerModel({
    details: "Placeat rerum totam in est accusamus voluptatem velit in. Reiciendis aut labore non recusandae quia sed. Expedita hic et consequatur quaerat perferendis quia quaerat laudantium.",
    user: user._id,
    questionId: question._id
  } as IAnswer)

  question.answers.push(answer._id)
  await answer.save()
  await question.save()

}
