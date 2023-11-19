import express, { type Express } from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors';
import { handleErrors } from '../middleware/errorHandlerMiddleware'
import { checkUser } from '../middleware/authMiddleware'
import { appRoutes } from '../routes/appRoutes'

import corsConfig from '../config/corsConfig.json'

export const createServer = (): Express => {
  const app = express()
  app.use(cors(corsConfig))
  app.use(express.json())
  app.use(cookieParser())
  app.use('*', checkUser)
  appRoutes(app)
  app.use(handleErrors)
  return app
}
