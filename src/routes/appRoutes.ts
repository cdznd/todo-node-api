import { type Express } from 'express'
import { authRoutes } from './authRoutes'
import { ticketRoutes } from './ticketRoutes'
import { categoryRoutes } from './categoryRoutes'

export const appRoutes = (app: Express): void => {
  app.use(authRoutes)
  app.use(ticketRoutes)
  app.use(categoryRoutes)
}
