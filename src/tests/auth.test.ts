import mongoose from 'mongoose'
import { createServer } from '../utils/appServer';
import request from 'supertest'
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as AuthController from '../controllers/authController';

let dbServer: any;
beforeAll(async () => {
    dbServer = await MongoMemoryServer.create()
    const dbServerURL = await dbServer.getUri()
    await mongoose.connect(dbServerURL)
})

afterEach(async () => {
    // Clear or drop collections as needed
    await mongoose.connection.dropCollection('users'); // Clear the 'users' collection
});

const app = createServer()

const userId = new mongoose.Types.ObjectId().toString()

const userPayload = {
    _id: userId,
    name: 'Tester test',
    email: 'tester@test.com',
}

const userInput = {
    "name": "User Test",
    "email": "tester@test.com",
    "password": "google1234"
}

//jest.mock('../controllers/authController.ts');

describe('Authentication Routes', () => {

    describe('User Signup', () => {

        describe('User attempts to register with valid email and password.', () => {
            it('Should return a 201 status code and the created user json', async () => {
                const { header, body, statusCode } = await request(app)
                    .post('/signup')
                    .send(userInput)
                // should return a 201 status code
                expect(statusCode).toBe(201)            
                // and created user json    
                expect(header['content-type']).toMatch(/json/)
                expect(body.name).toBe('a')
                expect(body.email).toBe(userInput.email)
            })
        })

        describe('User attempts to register with an existing email', () => {
            it('Should return a 409 status code with a "Account with this email already exists" error message.', async () => {
                // First create a user
                await request(app).post('/signup').send(userInput).set('Accept', 'Application/json')
                // Attempt to recreate
                const response = await request(app).post('/signup').send(userInput).set('Accept', 'Application/json')
                expect(response.statusCode).toBe(409)
            })
        })

        describe.skip('User attempts to register with a weak password', () => {
            it('Should return a 400 status code with a "Password must be at least 8 characters" error message.', async () => {
                const response = await request(app).post('/signup').send({
                    "name": "User Test",
                    "email": "tester@test.com",
                    "password": "123"
                }).set('Accept', 'Application/json')
                expect(response.statusCode).toBe(400)
                expect(response.body).toBe('')
            })
        })

        // })

        // describe('User attemps to register without providing an email', () => {
        //     it('Should return a 400 status code with a "Email is required" error message.', () => {

        //     })
        // })

        // describe('User attempts to register without providing a password', () => {
        //     it('Should return a 400 status code with a "Password is required" error message.', () => {

        //     })
        // })

        // describe('User attempts to register with an empty username and password.', () => {
        //     it('Should return a 400 status code with "Username and password are required" error message.', () => {

        //     })
        // })

        // describe('User attempts to register with an invalid email format', () => {
        //     it('Should return a 400 status code with an "Invalid email format" error message.', () => {

        //     })
        // })

        // describe('User attempts to register with a username that contains special characters.', () => {
        //     it('Should return a 400 status code with a "Username must not contain special characters" error message.', () => {

        //     })
        // })

        // describe('User attempts to register with a username and password that exceed maximum length limits.', () => {
        //     it('It should return a 400 status code with a "Username and password length exceeds limits" error message.', () => {

        //     })
        // })

        // describe('User attempts to register with valid data, but the server is temporarily unavailable.', () => {
        //     it('It should return a 503 status code with a "Service temporarily unavailable" error message.', () => {

        //     })
        // })

    })

    // describe('User Login', () => {

    //     describe('User attempts to login with a valid username and password.', () => {
    //         it('Should return a 200 status code and a JWT token.', async () => {
    //             // Creating a user
    //             await request(app).post('/signup').send(userInput).set('Accept', 'Application/json')
    //             // Login Attempt
    //             const response = await request(app)
    //                 .post(`/login`)
    //                 .send({
    //                     email: userInput.email,
    //                     password: userInput.password
    //                 })
    //                 .set('Accept', 'application/json')
    //                 .expect(400)
    //             // It should return a 200 status
    //             expect(response.statusCode).toBe(400)
    //             // and a JWT Token
    //             // ...
    //         })
    //     })

    //     describe('User attempts to login with email and password that do not match', () => {
    //         it('Should return a 401 status code with an "Unauthorized" error message.', async () => {
    //             await request(app).post('/signup').send(userInput).set('Accept', 'Application/json')
    //             const response = await request(app)
    //                 .post(`/login`)
    //                 .send({
    //                     email: userInput.email,
    //                     password: 'wrongpassword'
    //                 })
    //                 .set('Accept', 'application/json')
    //                 .expect(400)
    //             expect(response.statusCode).toBe(400)
    //         })
    //     })

    //     describe('User attempts to login without providing email', () => {
    //         it('Should return a 400 status code with a "Email is required" error message.', () => {

    //         })
    //     })

    //     describe('User attempts to login without providing a password', () => {
    //         it('Should return a 400 status code with a "Password is required" error message', () => {

    //         })
    //     })

    //     describe('User attempts to login with an empty email and password', () => {
    //         it('Should return a 400 status code with a "Username and Password are required" error message', () => {

    //         })
    //     })

    // })

});

afterAll(async () => {
    await mongoose.disconnect();
    await dbServer.stop();
})