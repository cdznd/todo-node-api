import { type NextFunction, type Request, type Response } from 'express'
import { UserModel } from '../models/User'
import jwt from 'jsonwebtoken'
import { JWT_SECRET_KEY } from '../config'
import { type Types } from 'mongoose'
import { omit } from 'lodash'

// This function must create an Access and a Refresh Token.
const createAuthTokens = (userEmail: string): { accessToken: string, refreshToken: string} => {
  // Payload: Used to identify the user (e.g user_id).
  // It's data that is enconded into the JWT.
  // It's important that no sensitive data must be stored here
  const jwtPayload = { userEmail }
  // JWT Signing process - Makes the token secure like a stamp of authenticity of the server.
  // Sign the given payload into a Json Web Token.
  // Short TTL
  const accessToken = jwt.sign(jwtPayload, JWT_SECRET_KEY, { expiresIn: '30s' })
  // Long TTL, and must be saved on the database
  const refreshToken = jwt.sign(jwtPayload, JWT_SECRET_KEY, { expiresIn: '1d' })

  return {
    accessToken,
    refreshToken
  }
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
  const { include } = req.query

  try {
    const user = await UserModel.login(email, password)
    
    const { accessToken, refreshToken } = createAuthTokens(user.email)

    let userInfo
    if (include === 'user') {
      userInfo = user
    }

    // Refresh Token on the Cookie as httpOnly
    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // one day
    })
    // Returning the AccessToken on the response
    res.status(200).json({
      accessToken,
      userInfo
    })
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
