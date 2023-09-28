import { type Express } from 'express'
import { authRoutes } from './authRoutes'
import { ticketRoutes } from './ticketRoutes'

export const appRoutes = (app: Express): void => {
  app.use(authRoutes)
  app.use(ticketRoutes)
}
