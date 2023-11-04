import mongoose from 'mongoose'
import { createServer } from '../utils/appServer'
import request from 'supertest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { authEndpoints, categoryEndpoints } from '../config/endpoints'

// Starting express application
const app = createServer()

// Useful Objects to use on the tests
const categoryInput = {
  title: 'New WebSite'
}

const userInput = {
  name: 'User Test',
  email: 'tester@test.com',
  password: 'google1234'
}

// Auth
let jwtCookie: any
let userId: any
// DB
let dbServer: any

// One-Time setup, this block of code is going to be executed before all tests begin.
beforeAll(async () => {
  // Starting Mongo Memory server
  dbServer = await MongoMemoryServer.create()
  const dbServerURL = await dbServer.getUri()
  await mongoose.connect(dbServerURL)

  // Creating a new user
  await request(app).post(authEndpoints.signup).send(userInput)
  const { headers, body: bodyUser } = await request(app).post(authEndpoints.login).send({
    email: userInput.email,
    password: userInput.password
  })
  jwtCookie = headers['set-cookie'][0]
  userId = bodyUser._id
})

// After all tests finish Mongo Mermory Server execution.
afterAll(async () => {
  await mongoose.disconnect()
  await dbServer.stop()
})

// Clear the categories collection before each test
afterEach(async () => {
  await mongoose.connection.collection('categories').deleteMany({})
})

describe('Category routes', () => {
  describe('Creating a Category', () => {
    describe('Authorized user tests', () => {
      describe('An authorized user tries to create a new category with a valid title.', () => {
        it('Should return a 201 Status code with the newly created category in the response body', async () => {
          const { statusCode, body } = await request(app)
            .post(categoryEndpoints.categories)
            .send(categoryInput)
            .set('Cookie', jwtCookie)
          expect(statusCode).toBe(201)
          expect(body.title).toBe(categoryInput.title)
          expect(body.created_by).toBe(userId)
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
      // Sample categories
      let createdCategories: any = []
      /*
        Creating 100 categories before each test of this suite
        OBS: The categories collection is cleared after each test
      */
      beforeEach(async () => {
        const categoryNumber = 100
        for (let counter = 0; counter < categoryNumber; counter++) {
          const { body: createdTicketBody } = await request(app)
            .post(categoryEndpoints.categories)
            .send({ title: `Category ${counter}` })
            .set('Cookie', jwtCookie)
          createdCategories.push(createdTicketBody)
        }
      })

      afterEach(async () => {
        // OBS: The categories collection is cleared after each test
        createdCategories = []
      })

      describe('An authorized user retrieves a pagineted list of categories', () => {
        it('Should return a 200 status code and an array of categories in the response body', async () => {
          const { statusCode, body } = await request(app)
            .get(categoryEndpoints.categories)
            .set('Cookie', jwtCookie)

          expect(statusCode).toBe(200)
          expect(body.data).toBeInstanceOf(Array)
          expect(body.data.length).toBeGreaterThan(0)
        })

        it('Should have valid categories objects on the response Array', async () => {
          const { statusCode, body } = await request(app)
            .get(categoryEndpoints.categories)
            .set('Cookie', jwtCookie)

          const firstItem = body.data[0]

          expect(statusCode).toBe(200)
          expect(firstItem).toBeInstanceOf(Object)

          expect(firstItem).toHaveProperty('title')
          expect(firstItem).toHaveProperty('created_by')
          expect(firstItem).toHaveProperty('createdAt')
          expect(firstItem).toHaveProperty('updatedAt')

          expect(firstItem.created_by).toBe(userId)

          const secondItem = body.data[1]

          expect(statusCode).toBe(200)
          expect(secondItem).toBeInstanceOf(Object)

          expect(secondItem).toHaveProperty('title')
          expect(secondItem).toHaveProperty('created_by')
          expect(secondItem).toHaveProperty('createdAt')
          expect(secondItem).toHaveProperty('updatedAt')

          expect(secondItem.created_by).toBe(userId)
        })

        it('Should have links, meta, and data properties in the response body', async () => {
          const { body } = await request(app)
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
        it('Should return a 200 status code, with the specified category on the response body', async () => {
          const categoryId = createdCategories[0]._id
          const { statusCode, body } = await request(app)
            .get(`${categoryEndpoints.categories}/${categoryId}`)
            .set('Cookie', jwtCookie)
          expect(statusCode).toBe(statusCode)
          expect(body).toHaveProperty('title')
          expect(body.title).toBe(createdCategories[0].title)
          expect(body.created_by).toBe(userId)
        })

        // TODO
        // it('should retrieve a category by its unique ID', () => { })

        // it('should retrieve a category by its title', () => { })

        // it('should retrieve a category by the user who created it', () => { })

        it('Should handle non-existent categories IDs with a 404 status code', async () => {
          const { statusCode, body } = await request(app)
            .get(`${categoryEndpoints.categories}/nonexisting`)
            .set('Cookie', jwtCookie)
          expect(statusCode).toBe(404)
          expect(body).toBe('Category not found')
        })
      })
    })

    describe('An unauthorized user tries to retrieve a list of categories', () => {
      it('Should return a 401 Unauthorized status code', async () => {
        const { statusCode, body } = await request(app)
          .get(`${categoryEndpoints.categories}`)
        expect(statusCode).toBe(400)
        expect(body).toBe('Authentication credentials were not provided.')
      })
    })

    describe('An unauthorized user tries to retrieve an specific category', () => {
      it('Should return a 401 Unauthorized status code', async () => {
        const { statusCode, body } = await request(app)
          .get(`${categoryEndpoints.categories}`)
        expect(statusCode).toBe(400)
        expect(body).toBe('Authentication credentials were not provided.')
      })
    })
  })

  describe('Updating existing category', () => {
    describe('Authorized user tests', () => {
      // Sample category
      let categoryId: string

      // Creating a category before each test
      beforeEach(async () => {
        const { body } = await request(app)
          .post(categoryEndpoints.categories)
          .send({ title: categoryInput.title })
          .set('Cookie', jwtCookie)
        categoryId = body._id
      })

      describe('Authorized user updates an existing category', () => {
        it('should return a 200 status code with updated category details in the response body', async () => {
          const { statusCode, body } = await request(app)
            .put(`${categoryEndpoints.categories}/${categoryId}`)
            .send({ title: 'NEW TITLE' })
            .set('Cookie', jwtCookie)

          expect(statusCode).toBe(201)
          expect(body.modifiedCount).toBe(1)

          // Comparing new category with old one.
          const { statusCode: newCategoryStatusCode, body: newCategoryBody } = await request(app)
            .get(`${categoryEndpoints.categories}/${categoryId}`)
            .set('Cookie', jwtCookie)

          expect(newCategoryStatusCode).toBe(200)
          expect(newCategoryBody.title).not.toBe(categoryInput.title)
          expect(newCategoryBody.title).toBe('NEW TITLE')
        })
      })

      describe('Authorized user tries to update a non-existent ticket', () => {
        it('Should return a 404 status code with an informative message', async () => {
          const newCategoryId = new mongoose.Types.ObjectId().toString()

          const { statusCode, body } = await request(app)
            .put(`${categoryEndpoints.categories}/${newCategoryId}`)
            .send(categoryInput)
            .set('Cookie', jwtCookie)

          expect(statusCode).toBe(404)
          expect(body).toBe('Category not found')
        })
      })
    })

    describe('Unauthorized user tries to update a category', () => {
      it('Should return a 401 Unauthorized status code', async () => {
        const { statusCode, body } = await request(app)
          .put(`${categoryEndpoints.categories}/123`)
          .send({ title: 'NEW TITLE' })
        expect(statusCode).toBe(400)
        expect(body).toBe('Authentication credentials were not provided.')
      })
    })
  })

  describe('Deleting existing categories', () => {
    describe('Authorized user tests', () => {
      // Sample category
      let categoryId: string

      // Creating a category before each test
      beforeEach(async () => {
        const { body } = await request(app)
          .post(categoryEndpoints.categories)
          .send({ title: categoryInput.title })
          .set('Cookie', jwtCookie)
        categoryId = body._id
      })

      describe('Authorized user delete an existing category', () => {
        it('Should return a 200 status code with a "Deleted Successfully" message', async () => {
          const { statusCode, body } = await request(app)
            .delete(`${categoryEndpoints.categories}/${categoryId}`)
            .set('Cookie', jwtCookie)

          expect(statusCode).toBe(200)
          expect(body.deletedCount).toBe(1)

          // Checking the existense of the deleted category
          const { statusCode: deletedCategoryStatusCode, body: deletedCategoryBody } = await request(app)
            .get(`${categoryEndpoints.categories}/${categoryId}`)
            .set('Cookie', jwtCookie)

          expect(deletedCategoryBody).toStrictEqual('Category not found')
          expect(deletedCategoryStatusCode).toBe(404)
        })
      })

      describe('Authorized user tries to delete a non-existent category', () => {
        it('should return a 404 status code with an informative message', async () => {
          const { statusCode, body } = await request(app)
            .delete(`${categoryEndpoints.categories}/NOEXISTINGID`)
            .set('Cookie', jwtCookie)
          expect(statusCode).toBe(404)
          expect(body).toStrictEqual('Category not found')
        })
      })
    })

    describe('Unauthorized user tries to delete a category', () => {
      it('Should return a 401 Unauthorized status code', async () => {
        const { statusCode, body } = await request(app)
          .delete(`${categoryEndpoints.categories}/123`)
        expect(statusCode).toBe(400)
        expect(body).toBe('Authentication credentials were not provided.')
      })
    })
  })
})
