import * as mongoose from "mongoose"
import autopopulate from "mongoose-autopopulate"
import idValidator from "mongoose-id-validator"
import { convertEnumToStringArray } from "../core/common"
import mongooseSanitize from "../core/sanitize-schema"

const Schema = mongoose.Schema

export interface ITag extends mongoose.Document {
  title: string
}

const schemaDef = new Schema(
  {
    title: {
      type: String,
      default: ""
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

export default mongoose.model<ITag>("Tag", schemaDef)
