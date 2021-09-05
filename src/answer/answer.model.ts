import * as mongoose from "mongoose"
import autopopulate from "mongoose-autopopulate"
import idValidator from "mongoose-id-validator"
import mongooseSanitize from "../core/sanitize-schema"
import { IQuestion } from "../question/question.model"
import userModel, { IUser } from "../user/user.model"

const Schema = mongoose.Schema

export interface IAnswer extends mongoose.Document {
  details: string
  likes: number
  user: IUser | string
  questionId: IQuestion | string
}

const schemaDef = new Schema(
  {
    details: {
      type: String,
      required: true
    },
    likes: {
      type: Number,
      default: 0
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: userModel.modelName,
      autopopulate: {
        select: "userName name"
      }
    },
    questionId: {
      type: Schema.Types.ObjectId,
      autopopulate: false
    }
  },
  {
    timestamps: true
  }
)

schemaDef.plugin(require("mongoose-unique-validator"))
schemaDef.plugin(mongooseSanitize)
schemaDef.plugin(idValidator)
schemaDef.plugin(autopopulate)
schemaDef.set("toObject", {
  getters: true
})
schemaDef.set("toJSON", {
  getters: true
})

export default mongoose.model<IAnswer>("Answer", schemaDef)
