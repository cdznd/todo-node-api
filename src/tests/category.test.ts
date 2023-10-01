import mongoose from 'mongoose'
import { createServer } from '../utils/appServer'
import request from 'supertest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { authEndpoints, categoryEndpoints } from '../config/endpoints'

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
  title: 'New WebSite'
}

const userInput = {
  name: 'User Test',
  email: 'tester@test.com',
  password: 'google1234'
}

describe('Category routes', () => {
  describe('Creating a Category', () => {

    describe('Authorized user tests', () => {
      let jwtCookie: any
      let userId: any

      beforeAll(async () => {
        await request(app).post(authEndpoints.signup).send(userInput)
        const { headers, body: user } = await request(app).post(authEndpoints.login).send({
          email: userInput.email,
          password: userInput.password
        })
        jwtCookie = headers['set-cookie'][0]
        userId = user._id
      })

      describe('An authorized user tries to create a new category with a valid title.', () => {
        it('Should return a 201 Status code with the newly created ticket in the response body', async () => {
          const { statusCode, body } = await request(app)
            .post(categoryEndpoints.categories)
            .send(categoryInput)
            .set('Cookie', jwtCookie)
          expect(statusCode).toBe(201)
          expect(body.title).toBe(categoryInput.title)
          expect(body.user_id).toBe(userId)
        })
      })

      describe('User tries to create a new category without providing mandatory fields', () => {
        it('Should return a 400 Bad Request status code with an error message indicating which fields are missing.', async () => {
          const { statusCode, body } = await request(app)
            .post(categoryEndpoints.categories)
            .send({})
            .set('Cookie', jwtCookie)
          expect(statusCode).toBe(400)
          expect(body).toHaveProperty('errors')
          expect(body.errors).toHaveProperty('title')
          expect(body.errors.title).toBe('Title field is required')
        })
      })

    })

    describe('An unauthorized user tries to create a new category', () => {
      it('Should return a 401 Unauthorized user status code, indicating that the user is not authenticated', async () => {
        const { statusCode, body } = await request(app)
          .post(categoryEndpoints.categories)
          .send(categoryInput)
        expect(statusCode).toBe(400)
        expect(body).toBe('Authentication credentials were not provided.')
      })
    })

  })

  describe('Retrieving and listing categories', () => {

    describe('Authorized user tests', () => {
      let jwtCookie: any
      let userId: any

      beforeAll(async () => {
        await request(app).post(authEndpoints.signup).send(userInput)
        const { headers, body: user } = await request(app).post(authEndpoints.login).send({
          email: userInput.email,
          password: userInput.password
        })
        jwtCookie = headers['set-cookie'][0]
        userId = user._id
      })

      describe.only('An authorized user retrieves a pagineted list of categories', () => {

        beforeAll(async () => {

          // Creating a bunch of categories before test
          const category_number = 100

          for (let counter = 0; counter < category_number; counter++) {

            await request(app)
              .post(categoryEndpoints.categories)
              .send({ title: `Category ${counter}` })
              .set('Cookie', jwtCookie)
          }

        })

        it('Should return a 200 status code and an array of categories in the response body', async () => {

          const { statusCode, body } = await request(app)
            .get(categoryEndpoints.categories)
            .set('Cookie', jwtCookie)

          expect(statusCode).toBe(200)
          expect(body.data).toBeInstanceOf(Array)
          expect(body.data.length).toBeGreaterThan(0)

        })

        it('Should have links, meta, and data properties in the response body', async () => {
          const { statusCode, body } = await request(app)
            .get(categoryEndpoints.categories)
            .set('Cookie', jwtCookie)

          expect(body).toHaveProperty('links')
          expect(body).toHaveProperty('meta')
          expect(body).toHaveProperty('data')
        })

        it('Should support pagination and return the specified number of categories per page', async () => {
          const { statusCode, body } = await request(app)
            .get(categoryEndpoints.categories)
            .set('Cookie', jwtCookie)

          const itemsPerPage = body.meta.totalItems / body.meta.totalPages
          expect(body.meta.totalPages).toBe(10)
          expect(statusCode).toBe(200)
          expect(body.data.length).toBe(itemsPerPage)

        })

        it('Should support pagination displaying different pages', async () => {
          const { statusCode, body } = await request(app)
            .get(`${categoryEndpoints.categories}?page=2`)
            .set('Cookie', jwtCookie)

          const itemsPerPage = body.meta.totalItems / body.meta.totalPages
          expect(body.meta.totalPages).toBe(10)
          expect(statusCode).toBe(200)
          expect(body.data.length).toBe(itemsPerPage)

        })

        it('Should support pagination displaying different pages with different limits', async () => {
          const { statusCode, body } = await request(app)
            .get(`${categoryEndpoints.categories}?page=2&limit=3`)
            .set('Cookie', jwtCookie)

          // Number of pages when there's 3 items per page = 34 page
          expect(body.meta.totalPages).toBe(34)
          expect(statusCode).toBe(200)
          expect(body.data.length).toBe(3)
        })

      })

      describe('An authorized user tries to retrieve a specific category', () => {
        it('Should return a 200 status code, with the specified category on the response body', () => { })

        it('should retrieve a category by its unique ID', () => { })

        it('should retrieve a category by its title', () => { })

        it('should retrieve a category by the user who created it', () => { })

        it('should handle non-existent categories IDs with a 404 status code', () => { })
      })


    })

    // describe('An unauthorized user tries to retrieve a list of categories', () => {
    //   it('Should return a 401 Unauthorized status code', () => { })
    //   it('Should not allow unauthorized access to ticket details', () => { })
    // })

    // describe('An unauthorized user tries to retrieve an specific category', () => {
    //   it('Should return a 401 Unauthorized status code', () => { })
    //   it('Should not allow unauthorized access to ticket details', () => { })
    // })

  })

  // describe('Updating existing category', () => {

  //   describe('Authorized user tests', () => {

  //     describe('Authorized User Updates an Existing category', () => {
  //       it('should return a 200 status code with updated category details in the response body', async () => { })
  //     })

  //     describe('Authorized User tries to update a Non-Existent Ticket', () => {
  //       it('should return a 404 status code with an informative message', async () => { })
  //     })

  //   })

  //   describe('Unauthorized User Tries to Update an Existing Ticket', () => {
  //     it('should return a 401 Unauthorized status code', async () => { })
  //   })

  // })

})

afterAll(async () => {
  await mongoose.disconnect()
  await dbServer.stop()
})
