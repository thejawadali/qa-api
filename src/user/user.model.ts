import * as mongoose from "mongoose"
import autopopulate from "mongoose-autopopulate"
import idValidator from "mongoose-id-validator"
import { convertEnumToStringArray } from "../core/common"
import mongooseSanitize from "../core/sanitize-schema"

const Schema = mongoose.Schema

export interface IUser extends mongoose.Document {
  _id: any;
  name: string;
  userName: string;
  password: string;
  role: Roles
}
export enum Roles {
  User = "User"
}

const schemaDef = new Schema(
  {
    name: {
      type: String,
      default: ""
    },
    role: {
      type: String,
      default: Roles.User,
      enum: convertEnumToStringArray(Roles)
    },
    userName: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      index: true
    },
    password: {
      type: String,
      required: true
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

// interface IUserDoc extends IUser, mongoose.Document {}
export default mongoose.model<IUser>("User", schemaDef)
