import express, { type Express } from 'express'
import cors from 'cors';
import cookieParser from 'cookie-parser'
import { checkUser } from '../middleware/authMiddleware';

// Middlewares
import { handleErrors } from '../middleware/errorHandlerMiddleware'

// Routes
import { authRoutes } from '../routes/authRoutes';
import { healthcheckRoutes } from '../routes/healthcheckRoutes';
import { ticketRoutes } from '../routes/ticketRoutes';
import { categoryRoutes } from '../routes/categoryRoutes';
//
import swaggerDocs from './swagger';

import { CORS_CONFIG } from '../config/cors.config';
import { PORT } from '../config/app.config';

export const createServer = (): Express => {
  
  const app = express()

  // Cross Origin Resource Sharing configuration
  app.use(cors(CORS_CONFIG))
  
  // Built-in JSON Middleware
  app.use(express.json())
  // Cookies Middleware
  app.use(cookieParser())
  
  // Not protected routes
  app.use(healthcheckRoutes)
  // Authentication Routes
  app.use(authRoutes)
  // Starting Swagger Docs
  swaggerDocs(app, PORT)

  // Protecting the other routes
  // app.use(requireAuth)
  
  app.use(checkUser)
  // Protected Routes
  app.use(ticketRoutes)
  app.use(categoryRoutes)
    
  // Error Handling Middleware
  app.use(handleErrors)
  
  return app
}
