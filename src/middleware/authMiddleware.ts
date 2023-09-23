import jwt from 'jsonwebtoken'
import { type Request, type Response, type NextFunction, type RequestHandler } from 'express'
import { JWT_SECRET_KEY } from '../config'
import { getUserById } from '../models/User'

export const requireAuth: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt
  if (token) {
    jwt.verify(token, JWT_SECRET_KEY, (err: any, decodedToken: string) => {
      if (err != null) {
        res.status(400).json({ error: 'error during token vefirication' })
      } else {
        next()
      }
    })
  } else {
    res.status(400).json({ error: 'error token not found' })
  }
}

export const checkUser: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  console.log('CheckUser...')
  const token = req.cookies.jwt
  if (token) {
    jwt.verify(token, JWT_SECRET_KEY, async (err: any, decodedToken: any) => {
      try {
        if (err) {
          next(err)
          // res.status(400).json({ error: 'error during token vefirication' })
        } else {
          res.locals.user = await getUserById(decodedToken.id) || res.locals.user;
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
