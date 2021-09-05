import { Router } from "express"
import "express-async-errors"
import { body } from "express-validator"
import { max, min } from "lodash"
import { signJwt } from "../core/authorization"
import { encrypt, hashPassword } from "../core/crypt"
import { validationErrorChecker } from "../core/error-handler"
import userModel, { IUser } from "./user.model"

require("dotenv").config()

const router = Router()

// Login
router.post(
  "/login",
  [
    body("userName").exists(),
    body("password").exists().isLength({
      min: 8,
      max: 32
    })
  ],
  validationErrorChecker,
  async (req, res) => {
    try {
      const user = await userModel
        .findOne({
          userName: req.body.userName,
          password: hashPassword(req.body.password)
        })
        // .select("-password")
      // throw error if user not found
      if (!user) {
        res.status(400).send("User Not Found")
        return
      }
      const jwtToken = signJwt({
        _a: user._id,
        _b: encrypt(hashPassword(req.body.password))
      })

      res.status(200).json({
        user: {
          ...user.toJSON(),
          password: undefined
        },
        token: jwtToken
      })
    } catch (e) {
      res.status(400).send("Invalid User Credentials")
      return
    }
  }
)


// Register
router.post(
  "/register",
  [
    body("userName").exists(),
    body("name").exists(),
    body("password").exists().isLength({
      min: 8,
      max: 32
    })
  ],
  validationErrorChecker,
  async (req, res) => {
    // check if user with the given id already exists throw error
    if (await userModel.findOne({
      userName: req.body.userName
    })) {
      res.status(400).send("Please try another username")
        return
    }
    const userToSave = new userModel({
      name: req.body.name,
      userName: req.body.userName,
      password: hashPassword(req.body.password)
    } as IUser)

    const jwtToken = signJwt({
      _a: userToSave._id,
      _b: encrypt(hashPassword(req.body.password))
    })
    await userToSave.save()
    res.status(201).json({
      user: {
        ...userToSave.toJSON(),
        password: undefined
      },
      token: jwtToken
    })
  }
)

export default router
