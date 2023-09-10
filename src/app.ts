import express from 'express';
import mongoose from 'mongoose';
import { PORT, MONGO_DB_URL } from './config';

import { authRoutes } from './routes/AuthRoutes'

// Init
const app = express()

// Middlewares
app.use(express.json());

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

// Middleware using external routes
app.use(authRoutes)

// Routes
app.get('/status', (req: express.Request, res: express.Response) => {

	const audioFile = {};

	// // callback funcions for processAudio
	// const successProcess = () => {
	// 	res.send('Success')
	// }

	const checkUsers = new Promise((resolver: Function, reject: Function) => {

		let findUsers = true;

		if (findUsers) {
			// Delay to execute the resolver.
			setTimeout(() => { resolver('56 Users found') }, 5000)
		} else {
			reject('Any user found');
		}

	});

	

})
