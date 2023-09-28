import express, { type Express } from 'express'
import cookieParser from 'cookie-parser'
import { handleErrors } from '../middleware/errorHandlerMiddleware'
import { checkUser } from '../middleware/authMiddleware'
import { appRoutes } from '../routes/appRoutes'

export const createServer = (): Express => {
  const app = express()
  app.use(express.json())
  app.use(cookieParser())
  app.use('*', checkUser)
  appRoutes(app)
  app.use(handleErrors)
  return app
}
