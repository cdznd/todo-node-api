import { type Express } from 'express'
import { authRoutes } from './authRoutes'
import { ticketRoutes } from './ticketRoutes'

export const appRoutes = (app: Express) => {
    app.use(authRoutes)
    app.use(ticketRoutes)
}