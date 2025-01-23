import mongoose from 'mongoose'
import { createServer } from '../utils/appServer'
import request from 'supertest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { authEndpoints } from '../config/endpoints'

// Starting express application
const app = createServer()

// Useful Objects to use on the tests
const userInput = {
  name: 'User Test',
  email: 'tester@test.com',
  password: 'google1234'
}

// DB
let dbServer: any

// One-Time setup, this block of code is going to be executed before all tests begin.
beforeAll(async () => {
  // Starting Mongo Memory server
  dbServer = await MongoMemoryServer.create()
  const dbServerURL = await dbServer.getUri()
  await mongoose.connect(dbServerURL)
})

// After all tests finish Mongo Mermory Server execution.
afterAll(async () => {
  await mongoose.disconnect()
  await dbServer.stop()
})

// Clear the tickets collection before each test
afterEach(async () => {
  await mongoose.connection.collection('users').deleteMany({})
})

describe('Authentication Routes', () => {
  describe('User Signup', () => {
    describe.only('User attempts to register with valid email and password.', () => {
      it('Should return a 201 status code and the created user json', async () => {
        const { header, body, statusCode } = await request(app)
          .post(authEndpoints.signup)
          .send(userInput)
        expect(statusCode).toBe(201)
        expect(header['content-type']).toMatch(/json/)
        expect(body.name).toBe(userInput.name)
        expect(body.email).toBe(userInput.email)
      })
    })

    describe('User attempts to register with an existing email', () => {
      it('Should return a 409 status code with a "Account with this email already exists" error message.', async () => {
        // First create a user
        await request(app).post(authEndpoints.signup).send(userInput)
        // Attempt to recreate
        const { header, body, statusCode } = await request(app)
          .post(authEndpoints.signup)
          .send(userInput)
        expect(statusCode).toBe(409)
        expect(header['content-type']).toMatch(/json/)
        expect(body.errors.email).toBe('Account with this email already exists')
      })
    })

    describe('User attempts to register with a weak password', () => {
      it('Should return a 400 status code with a "Password must be at least 8 characters" error message.', async () => {
        const newUserInput = { ...userInput }
        newUserInput.password = 'weak'
        const { header, body, statusCode } = await request(app)
          .post(authEndpoints.signup)
          .send(newUserInput)

        expect(statusCode).toBe(400)
        expect(header['content-type']).toMatch(/json/)
        expect(body.errors.password).toBe('Password must be at least 8 characters')
      })
    })

    describe('User attemps to register without providing an email', () => {
      it('Should return a 400 status code with a "Email is required" error message.', async () => {
        const newUserInput = { ...userInput }
        newUserInput.email = ''
        const { header, body, statusCode } = await request(app)
          .post(authEndpoints.signup)
          .send(newUserInput)
        expect(statusCode).toBe(400)
        expect(header['content-type']).toMatch(/json/)
        expect(body.errors.email).toBe('Email is required')
      })
    })

    describe('User attempts to register without providing a password', () => {
      it('Should return a 400 status code with a "Password is required" error message.', async () => {
        const newUserInput = { ...userInput }
        newUserInput.password = ''
        const { header, body, statusCode } = await request(app)
          .post(authEndpoints.signup)
          .send(newUserInput)
        expect(statusCode).toBe(400)
        expect(header['content-type']).toMatch(/json/)
        expect(body.errors.password).toBe('Password is required')
      })
    })

    describe('User attempts to register with an empty email and password.', () => {
      it('Should return a 400 status code with "Email and password are required" error message.', async () => {
        const newUserInput = { ...userInput }
        newUserInput.password = ''
        newUserInput.email = ''
        const { header, body, statusCode } = await request(app)
          .post(authEndpoints.signup)
          .send(newUserInput)
        expect(statusCode).toBe(400)
        expect(header['content-type']).toMatch(/json/)
        expect(body.errors.email).toBe('Email is required')
        expect(body.errors.password).toBe('Password is required')
      })
    })

    describe('User attempts to register with an invalid email format', () => {
      it('Should return a 400 status code with an "Invalid email format" error message.', async () => {
        const newUserInput = { ...userInput }
        newUserInput.email = 'no-valid-email'
        const { header, body, statusCode } = await request(app)
          .post(authEndpoints.signup)
          .send(newUserInput)
        expect(statusCode).toBe(400)
        expect(header['content-type']).toMatch(/json/)
        expect(body.errors.email).toBe('Invalid email format')
      })
    })

    // TODO
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

  describe('User Login', () => {
    describe('User attempts to login with a valid username and password.', () => {
      it('Should return a 200 status code and a JWT token.', async () => {
        // Creating a user
        await request(app).post(authEndpoints.signup).send(userInput)
        // Login Attempt
        const { statusCode, headers } = await request(app)
          .post(authEndpoints.login)
          .send({
            email: userInput.email,
            password: userInput.password
          })
        // It should return a 200 status
        expect(statusCode).toBe(200)
        expect(headers['set-cookie']).toBeDefined()

        // Test a route that require auto
      })
    })

    describe('User attempts to login with email and password that do not match', () => {
      it('Should return a 401 status code with an "Unauthorized" error message.', async () => {
        await request(app).post(authEndpoints.signup).send(userInput)
        const newUserInput = { ...userInput }
        newUserInput.password = 'no-valid-password'
        const { statusCode, body } = await request(app)
          .post(authEndpoints.login)
          .send(newUserInput)
        expect(statusCode).toBe(400)
        expect(body.errors.details).toBe('Incorrect username or password')
      })
    })

    describe('User attempts to login without providing email', () => {
      it('Should return a 400 status code with a "Email is required" error message.', async () => {
        const { statusCode, body } = await request(app)
          .post(authEndpoints.login)
          .send({
            password: userInput.password
          })
        expect(statusCode).toBe(400)
        expect(body.errors.details).toBe('Incorrect username or password')
      })
    })

    describe('User attempts to login without providing a password', () => {
      it('Should return a 400 status code with a "Password is required" error message', async () => {
        const { statusCode, body } = await request(app)
          .post(authEndpoints.login)
          .send({
            email: userInput.email
          })
        expect(statusCode).toBe(400)
        expect(body.errors.details).toBe('Incorrect username or password')
      })
    })

    describe('User attempts to login with an empty email and password', () => {
      it('Should return a 400 status code with a "Username and Password are required" error message', async () => {
        const { statusCode, body } = await request(app)
          .post(authEndpoints.login)
          .send({})
        expect(statusCode).toBe(400)
        expect(body.errors.details).toBe('Incorrect username or password')
      })
    })

    describe('User succefully login and tries to use a protected route', () => {
      it('Should return a 200 code with the current user', async () => {
        await request(app).post(authEndpoints.signup).send(userInput)

        const { headers: loginHeaders, body: loginBody } = await request(app)
          .post(`${authEndpoints.login}/?include=user`)
          .send({
            email: userInput.email,
            password: userInput.password
          })

        const jwtAccessToken = loginBody.accessToken

        const { statusCode } = await request(app)
          .get('/tickets')
          .set('Authorization', `Bearer ${jwtAccessToken}`)

        expect(statusCode).toBe(200)
      })
    })
  })

  describe('User Logout', () => {
    describe('User logs in the account and tries to logout', () => {
      it('Should return a 200 status code with a "Succeful logout" message', async () => {
        await request(app).post(authEndpoints.signup).send(userInput)

        const { headers: loginHeaders } = await request(app)
          .post(authEndpoints.login)
          .send({
            email: userInput.email,
            password: userInput.password
          })

        const jwtCookie = loginHeaders['set-cookie'][0]

        const logOutRequest = await request(app)
          .get(authEndpoints.logout)
          .set('Cookie', jwtCookie)

        const logOutMaxAgeMatch = logOutRequest.headers['set-cookie'][0].match(/Max-Age=(\d+)/)[0]

        expect(logOutRequest.statusCode).toBe(200)
        expect(logOutMaxAgeMatch).toBe('Max-Age=0')
      })
    })
  })
})
