import { parseInt } from "lodash"

export function convertEnumToStringArray (Enum: any): string[] {
  return Object.keys(Enum).filter((elem) => !parseInt(elem) && elem !== "0")
}