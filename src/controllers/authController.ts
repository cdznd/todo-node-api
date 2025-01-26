import { type NextFunction, type Request, type Response } from 'express'
import { UserModel } from '../models/User'
import jwt from 'jsonwebtoken'
import { JWT_ACCESS_TOKEN_SECRET, JWT_ACCESS_TOKEN_TTL, JWT_REFRESH_TOKEN_SECRET, JWT_REFRESH_TOKEN_TTL } from '../config/app.config'
import { omit } from 'lodash'

/**
 * This function must create an Access and a Refresh Token.
 */
const createAuthTokens = (userEmail: string): { accessToken: string, refreshToken: string } => {
  // Payload: Used to identify the user (e.g user_id).
  // It's data that is enconded into the JWT.
  // It's important that no sensitive data must be stored here
  const jwtPayload = {
    UserInfo: {
      email: userEmail
    }
  }
  // JWT Signing process - Makes the token secure like a stamp of authenticity of the server.
  // Sign the given payload into a Json Web Token.
  // Short TTL
  const accessToken = jwt.sign(jwtPayload, JWT_ACCESS_TOKEN_SECRET, { expiresIn: JWT_ACCESS_TOKEN_TTL })
  // Long TTL, and must be saved on the database
  const refreshToken = jwt.sign(jwtPayload, JWT_REFRESH_TOKEN_SECRET, { expiresIn: JWT_REFRESH_TOKEN_TTL })

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
  try {
    const user = await UserModel.login(email, password)
    const { accessToken, refreshToken } = createAuthTokens(user.email)
    res.cookie('jwt', refreshToken,
      {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000
      }
    )
    res.status(200).json({
      accessToken
    })
  } catch (err) {
    next(err)
  }
}

/**
 * It should issue a new Access token if the refresh token is valid
 */
export const refresh = (req: Request, res: Response, next: NextFunction): any => {
  const cookies = req.cookies
  const refreshToken = cookies?.jwt
  if (!refreshToken) return res.status(401).json({ message: 'Unauthorized' })
  /* eslint-disable-next-line @typescript-eslint/no-misused-promises */
  jwt.verify(refreshToken, JWT_REFRESH_TOKEN_SECRET, async (err: any, decodedToken: any) => {
    if (err) return res.json({ message: 'Not Authorized' })
    const foundUser = await UserModel.findOne({ email: decodedToken.UserInfo.email })
    if (!foundUser) return res.status(401).json({ message: 'Unauthorized' })
    const { accessToken } = createAuthTokens(foundUser.email)
    res.json({ accessToken })
  })
}

export const logout = (req: Request, res: Response): void => {
  res.clearCookie('jwt', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/'
  })
  res.clearCookie('Authorization', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/'
  })
  // console.log(`User with IP ${req.ip} logged out`);
  // Send a consistent JSON response
  res.status(200).json({ message: 'Logged out successfully' })
}

export const testing = (req: Request, res: Response): void => {
  res.status(200).send({ item: 'Hello my frined' })
}

export const me = async (req: Request, res: Response): Promise<void> => {
  const currentUser = res.locals.user
  res.status(200).send(currentUser)
}
