const { PORT } = require('./config.js')
const express = require('express');

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