import { type Express } from 'express'
import { authRoutes } from './authRoutes'
import { ticketRoutes } from './ticketRoutes'
import { categoryRoutes } from './categoryRoutes'
import { healthcheckRoutes } from './healthcheckRoutes'

export const appRoutes = (app: Express): void => {
  app.use(healthcheckRoutes)
  app.use(authRoutes)
  app.use(ticketRoutes)
  app.use(categoryRoutes)
}
