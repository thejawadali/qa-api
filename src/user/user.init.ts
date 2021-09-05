import { hashPassword } from "../core/crypt"
import userModel, { IUser, Roles } from "./user.model"

export default async function () {
  if (await userModel.countDocuments() <= 0) {
    const admin = new userModel({
      name: "QA User",
      password: hashPassword("12345678"),
      userName: "user123"
    })
    await admin.save()
  }
}
