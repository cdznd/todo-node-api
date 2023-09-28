import { type NextFunction, type Request, type Response } from 'express'
import { UserModel } from '../models/User'
import jwt from 'jsonwebtoken'
import { JWT_SECRET_KEY } from '../config'
import { type Types } from 'mongoose'
import { omit } from 'lodash'

// 2 hours
const maxAge = 60 * 60 * 2
const createToken = (id: Types.ObjectId): string => {
  return jwt.sign({ id }, JWT_SECRET_KEY, { expiresIn: maxAge })
}

export const signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { name, email, password } = req.body
  try {
    const userAlreadyExists = await UserModel.findOne({ email })
    if (userAlreadyExists) {
      res.status(409).json({ errors: { email: 'Account with this email already exists' } })
    } else {
      const newUser = await UserModel.create({ name, email, password })
      res.status(201).json(omit(newUser.toJSON(), 'password', '__v'))
    }
  } catch (err) {
    next(err)
  }
}

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password } = req.body
  try {
    const user = await UserModel.login(email, password)
    const token = createToken(user._id)
    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: maxAge * 1000
    })
    res.status(200).json(omit(user.toJSON(), 'password', '__v'))
  } catch (err) {
    next(err)
  }
}

export const logout = (req: Request, res: Response): void => {
  res.cookie('jwt', '', { maxAge: 1 })
  res.status(200).send('ok')
}

export const testing = (req: Request, res: Response): void => {
  res.status(200).send({ item: 'Hello my frined' })
}
