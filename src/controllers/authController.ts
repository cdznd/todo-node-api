import { type Request, type Response } from 'express'
import { UserModel, getUserByEmail } from '../models/User'
import jwt from 'jsonwebtoken'
import { JWT_SECRET_KEY } from '../config'
import { type Types } from 'mongoose'
import { handleErrors } from '../helpers'

interface Errors {
  errors: {
    name: Error
    email: Error
    password: Error
  }
  message: string
  code?: string
}

interface Error {
  properties: any
  kind: string
  path: string
  value?: string
  reason?: string
}

// 2 hours
const maxAge = 60 * 60 * 2
const createToken = (id: Types.ObjectId) => {
  return jwt.sign({ id }, JWT_SECRET_KEY, { expiresIn: maxAge })
}

export const signup = async (req: Request, res: Response) => {
  const { name, email, password } = req.body
  try {
    let userAlreadyExists
    // Check for duplicates
    if (email) {
      await getUserByEmail(email).then((item: any) => {
        if (item) {
          userAlreadyExists = true
        }
      })
    }
    if (userAlreadyExists) {
      res.status(400).json({ errors: 'Email already registered in another account' })
    } else {
      // Create new User
      const newUser = await UserModel.create({ name, email, password })
      const token = createToken(newUser._id)
      res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: maxAge * 1000
      })
      res.status(201).json({ user: newUser._id })
    }
  } catch (err) {
    res.status(400).json({ errors: handleErrors(err) })
  }
}

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body
  try {
    const user = await UserModel.login(email, password)
    const token = createToken(user._id)
    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: maxAge * 1000
    })
    res.status(200).json({ user: user._id })
  } catch (err) {
    res.status(400).json({ errors: handleErrors(err) })
  }
}

export const logout = (req: Request, res: Response) => {
  res.cookie('jwt', '', { maxAge: 1 })
  res.send(200)
}
