import mongoose from 'mongoose'
import { createServer } from '../utils/appServer'
import request from 'supertest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { authEndpoints, categoryEndpoints } from 'config/endpoints'

let dbServer: any
beforeAll(async () => {
    dbServer = await MongoMemoryServer.create()
    const dbServerURL = await dbServer.getUri()
    await mongoose.connect(dbServerURL)
})

afterEach(async () => {
    await mongoose.connection.collection('tickets').deleteMany({})
})

const app = createServer()

const categoryInput = {
    title: 'New WebSite',
}

const userInput = {
    name: 'User Test',
    email: 'tester@test.com',
    password: 'google1234'
}

describe('Category routes', () => {

    describe('Creating a Category', () => {

        describe('Authorized user tests', () => {

            let jwtCookie: any;
            let userId: any;

            beforeAll(async () => {
                await request(app).post(authEndpoints.signup).send(userInput);
                const { headers, body: user } = await request(app).post(authEndpoints.login).send({
                    email: userInput.email,
                    password: userInput.password,
                });
                jwtCookie = headers['set-cookie'][0];
                userId = user._id

            })

            describe('User tries to create a new category a valid title.', () => {
                it('Should return a 201 Status code with the newly created ticket in the response body', async () => {

                    const { statusCode, body } = await request(app)
                        .post(categoryEndpoints.categories)
                        .send(categoryInput)
                        .set('Cookie', jwtCookie)

                    expect(statusCode).toBe(201)
                    expect(body.title).toBe(ticketInput.title)
                    expect(body.category).toBe(ticketInput.category)
                    expect(body.status).toBe(ticketInput.status)
                    expect(body.priority).toBe(ticketInput.priority)
                    expect(body.user_id).toBe(userId)

                })
            })

        })

    })

})