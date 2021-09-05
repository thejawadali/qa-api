import * as mongoose from "mongoose"
import autopopulate from "mongoose-autopopulate"
import idValidator from "mongoose-id-validator"
import mongooseSanitize from "../core/sanitize-schema"
import tagModel, { ITag } from "../tag/tag.model"
import userModel, { IUser } from "../user/user.model"

const Schema = mongoose.Schema

export interface IQuestion extends mongoose.Document {
  title: string
  details: string
  views: number
  tags: ITag | string
  user: IUser | string
}

const schemaDef = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    details: {
      type: String,
      default: ""
    },
    views: {
      type: Number,
      default: 0
    },
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: tagModel.modelName,
        autopopulate: {
          select: "title"
        }
      }
    ],
    user: {
      type: Schema.Types.ObjectId,
      ref: userModel.modelName,
      autopopulate: {
        select: "userName name"
      }
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

export default mongoose.model<IQuestion>("Question", schemaDef)
