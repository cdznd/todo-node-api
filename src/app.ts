import express, { type Request, type Response } from 'express'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'

import { PORT, MONGO_DB_URL } from './config'

import { authRoutes } from './routes/authRoutes'
import { ticketRoutes } from './routes/ticketRoutes'
import { checkUser, requireAuth } from './middleware/authMiddleware'

// Init
const app = express()

// Middlewares
app.use(express.json())
app.use(cookieParser())

// DB Connection and Application start
mongoose.connect(MONGO_DB_URL).then(() => {
  console.log('Connected to MongoDB successfully!')
  app.listen(PORT, () => {
    console.log('Express application started successfully!')
  })
}).catch(err => {
  console.log('Some error happened when trying to connect to the DB.')
  console.log(err)
})

app.use('*', checkUser)

// Middlewares using external routes.
app.use(authRoutes)
app.use(ticketRoutes)