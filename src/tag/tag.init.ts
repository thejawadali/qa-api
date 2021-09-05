import tagModel, { ITag } from "./tag.model"

export default async function () {
  if (await tagModel.countDocuments() <= 0) {
    const admin = new tagModel({
      title: "javascript"
    } as ITag)
    await admin.save()
  }
}
