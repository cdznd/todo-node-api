import { type Request, type Response, type NextFunction, type RequestHandler } from 'express'
import jwt from 'jsonwebtoken'
import { JWT_SECRET_KEY } from '../config/app.config'
import { getUserById } from '../models/User'

/**
 * This function re-verifies the cookies, and check if there's a JWT Token on it.
 */
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

/**
 * This functions checks the cookies present in every request, for every request we'll check the cookies
 * If the cookies exists on the request we set a user on the response.locals.user, if not we set it to null
 */
export const checkUser: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt

  console.log('Inside checkUser')
  console.log(token)

  if (token) {
    jwt.verify(token, JWT_SECRET_KEY, async (err: any, decodedToken: any) => {
      try {
        if (err) {
          next(err)
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
