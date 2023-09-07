import express from 'express';
import mongoose from 'mongoose';
import { getUsers, createUser, getUserByName } from './models/User.js';
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

// User endpoints
app.get('/users', async (request, response) => {

	// console.log('before get Users');
	// console.log(getUsers);

	// createUser({
	// 	name: 'Allan Holdsworth',
	// 	email: 'allan@holdsworth.com',
	// 	authentication: {
	// 		salt: 'a',
	// 		password: 'a',
	// 		sessionToken: 'a',
	// 	}
	// })

	
	// const users = getUsers();

	const user = await getUsers();
	console.log(user);

	response.send('OK');

})

mongoose.Promise = Promise;
mongoose.connect(MONGO_DB_URL)
mongoose.connection.on('error', (error) => {
	console.log('Error!');
	console.log(error);
	console.log('');
});