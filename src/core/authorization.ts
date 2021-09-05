import * as express from "express"
import * as jwt from "jsonwebtoken"
import { each, hasIn, indexOf } from "lodash"
import userModel, { IUser, Roles } from "../user/user.model"
import { decrypt } from "./crypt"

require("dotenv").config()

const privateFile = process.env.SECRET

const algo = "HS512"

declare global {
  namespace Express {
    interface Request {
      user: IUser
    }
  }
}

export function signJwt (objToSign: object, expiresIn: string | null = null) {
  const jwtOptions: any = {
    algorithm: algo
  }

  if (expiresIn) {jwtOptions.expiresIn = expiresIn}
  return jwt.sign(objToSign, privateFile, jwtOptions)
}

/**
 * middleware to validate the jsonWebToken
 * only supporting token string to be present in jwt token
 */
export function authorizeByRole (...rolesEnum: Roles[]) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    let token: string = req.header("Authorization")?.replace(/(JWT|Bearer)\s/i, "") || req.body.token || req.query.token || ""
    token = typeof token !== "undefined" && token.length > 0 ? token.trim() : token
    const roles: string[] = []
    if (token) {
      // valid type of authorization is provided
      jwt.verify(token, privateFile, {
        algorithms: [
          algo
        ]
      }, (err, _doc: any) => {
        if (err) {
          return res.status(401).json(err)
        }
        // allRoles = convertEnumToStringArray(Roles)
        each(rolesEnum, (e) => {
          roles.push(Roles[e])
        })

        if (_doc) {
          userModel.findOne({
            _id: _doc._a,
            password: decrypt(_doc._b)
          })
            .then((userObj: any) => {
              if (userObj) {
                if (hasIn(userObj, "role")) {
                  if (indexOf(roles, userObj.role) < 0) {
                    res.status(403).send("Forbidden")
                    return
                  }
                } else {
                  res.status(401).send("Invalid Token")
                  return
                }
                req.user = userObj
                next()
              } else {
                console.log(decrypt(_doc._b))
                res.status(401).send("No logged in")
              }
            })
        } else {
          res.status(401).send("Invalid Token")

        }
      })
    } else {
      res.status(400).send("Auth Token missing")
    }
  }
}
