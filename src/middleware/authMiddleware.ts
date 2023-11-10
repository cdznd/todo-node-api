import jwt from 'jsonwebtoken'
import { type Request, type Response, type NextFunction, type RequestHandler } from 'express'
import { JWT_SECRET_KEY } from '../config'
import { getUserById } from '../models/User'

// Reverify token
export const requireAuth: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt
  if (token) {
    jwt.verify(token, JWT_SECRET_KEY, (err: any) => {
      if (err) {
        res.status(400).send('Authentication credentials were not provided.')
      } else {
        next()
      }
    })
  } else {
    res.status(400).json('Authentication credentials were not provided.')
  }
}

export const checkUser: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt
  if (token) {
    jwt.verify(token, JWT_SECRET_KEY, async (err: any, decodedToken: any) => {
      try {
        if (err) {
          next(err)
          // res.status(400).json({ error: 'error during token vefirication' })
        } else {
          res.locals.user = await getUserById(decodedToken.id) || res.locals.user
          next()
        }
      } catch (err) {
        next(err)
      }
    })
  } else {
    res.locals.user = null
    next()
  }
}
