import express from 'express';
import mongoose from 'mongoose';
import { PORT, MONGO_DB_URL } from './config';

import { signUp } from './controllers/Authentication'

const app = express()

app.use(express.json());

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});

app.get('/status', (req: express.Request, res: express.Response) => {
	// console.log('get app');
	res.send('OK')
})

app.post('/signup', signUp)

mongoose.Promise = Promise;
mongoose.connect(MONGO_DB_URL)
	.then(() => {
		console.log('Successfully Connected to MongoDB')
	})
	.catch((error) => {
		console.log(`Error when trying to connect to MongoDB: ${error}`)
	})