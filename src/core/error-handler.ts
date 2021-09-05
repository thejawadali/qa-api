import { Response, Request, NextFunction } from "express"
import { validationResult } from "express-validator"
import { uniq } from "lodash"

export const validationErrorChecker = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req)
  const mj = errors.formatWith((err) => `[${err.param}]:${err.msg}`)
  if (!errors.isEmpty()) {
    res.status(400).json(uniq(mj.array()))
  }
  else {
    next()
  }
}
