import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

import { PORT, MONGO_DB_URL } from './config';

import { authRoutes } from './routes/authRoutes'
import { requireAuth } from './middleware/authMiddleware';

// Init
const app = express()

// Middlewares
app.use(express.json());
app.use(cookieParser());

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

// Middleware using external routes.
app.use(authRoutes)

// Route to verify is there is an authenticated user.
app.get('/check_authentication', requireAuth, (req: Request, res: Response) => {
	res.json({message: 'HEEEEELOOOOO'})
})