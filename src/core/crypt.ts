
import crypto from "crypto"
import { random, shuffle } from "lodash"

require("dotenv").config()

const privateFile = process.env.SECRET || "vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3"

export const privateKey = crypto.createHash("sha256").update(String(privateFile)).digest("base64").substr(0, 32)

const algorithm = "aes-256-ctr"
const iv = crypto.randomBytes(16)
const hashSeperator = ":::::"

export function encrypt(obj: any): string {
  const text = JSON.stringify(obj) || ""
  const cipher = crypto.createCipheriv(algorithm, privateKey, iv)
  const encrypted = Buffer.concat([
    cipher.update(text),
    cipher.final()
  ])
  return `${iv.toString("hex")}${hashSeperator}${encrypted.toString("hex")}`
}

export function decrypt(text: string): string {
  const [
    hashiv,
    content
  ] = text.split(hashSeperator)
  const decipher = crypto.createDecipheriv(algorithm, privateKey, Buffer.from(hashiv, "hex"))

  const decrpyted = Buffer.concat([
    decipher.update(Buffer.from(content, "hex")),
    decipher.final()
  ])

  try {
    text = JSON.parse(decrpyted.toString())
  } catch (e) {
    console.error("invalid:string:decrypt")
    text = decrpyted.toString()
  }
  return text
}

// return the hashed value of given value
export function hashPassword(value: string): string {
  return !!value
    ? crypto
      .createHmac("sha512", privateFile)
      .update(value, "utf8")
      .digest("hex")
    : void 0
}
export function randPassword(length: number = 10): string {
  const uniqVal = new Date().getMilliseconds() + privateKey + new Date().getTime()
  const generatedHash: string[] = crypto.createHash("sha256").update(uniqVal.toString(), "utf8").digest("hex").split("")
  const b = shuffle(generatedHash).splice(12).join("")
  return b.substr(random(1, b.length - length), length)
}
