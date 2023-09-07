import express from 'express';
import mongoose from 'mongoose';
import { getUsers } from './models/User.js';
import { PORT, MONGO_DB_URL } from './config.js';

const app = express()

app.use(express.json());

app.listen(PORT, () => {
	console.log('Hello Backend JS World!');
	console.log(PORT)
});

app.get('/status', (request, response) => {
	// console.log('get app');
	response.send('OK')
})

app.get('/test', (request, response) => {

	console.log('before get Users');
	console.log(getUsers);

	response.send('ok');

})

mongoose.Promise = Promise;
mongoose.connect(MONGO_DB_URL)
mongoose.connection.on('error', (error) => {
	console.log('Error!');
	console.log(error);
	console.log('');
});