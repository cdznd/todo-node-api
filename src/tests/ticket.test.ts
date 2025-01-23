import mongoose from 'mongoose'
import { createServer } from '../utils/appServer'
import request from 'supertest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { ticketEndpoints, authEndpoints, categoryEndpoints } from '../config/endpoints'

// Starting express application
const app = createServer()

// Useful Objects to use on the tests
const userInput = {
  name: 'User Test',
  email: 'tester@test.com',
  password: 'google1234'
}

const categories = [
  'Web 3.0 Project',
  'GreenLabel',
  'Scratch',
  'Prototypes'
]

const statusOptions = [
  'In Progress',
  'Todo',
  'In Requirements'
]

const priorityOptions = [
  'Low',
  'Medium',
  'High',
  'Critical'
]

const ticketInput = {
  title: 'New WebSite',
  category: categories[1],
  status: statusOptions[0],
  priority: priorityOptions[0]
}

// Auth
let jwtAccessToken: any
let authenticatedUserId: any
// DB
let dbServer: any
// Sample data
const createdCategories: any = []

// One-Time setup, this block of code is going to be executed before all tests begin.
beforeAll(async () => {
  // Starting Mongo Memory server
  dbServer = await MongoMemoryServer.create()
  const dbServerURL = await dbServer.getUri()
  await mongoose.connect(dbServerURL)

  // Creating a new user
  await request(app).post(authEndpoints.signup).send(userInput)
  const { headers, body: bodyUser } = await request(app).post(`${authEndpoints.login}`).send({
    email: userInput.email,
    password: userInput.password
  })

  jwtAccessToken = bodyUser.accessToken

  // Get the id of the logged user
  // authenticatedUserId = bodyUser.userInfo._id

  // Creating sample categories
  for (const category of categories) {
    const { body } = await request(app).post(categoryEndpoints.categories).send({ title: category }).set('Authorization', `Bearer ${jwtAccessToken}`)
    createdCategories.push(body._id)
  }
})

// After all tests finish Mongo Mermory Server execution.
afterAll(async () => {
  await mongoose.disconnect()
  await dbServer.stop()
})

// Clear the tickets collection before each test
afterEach(async () => {
  await mongoose.connection.collection('tickets').deleteMany({})
})

describe.skip('Tickets Routes', () => {
  describe('Creating a Ticket', () => {
    describe('Authorized user tests', () => {
      describe('User tries to create a new ticket providing all valid data.', () => {
        it('Should return a 201 Status code with the newly created ticket in the response body', async () => {
          const updatedTicketInput = { ...ticketInput, category: createdCategories[0] }
          const { statusCode, body } = await request(app)
            .post(ticketEndpoints.tickets)
            .send(updatedTicketInput)
            .set('Authorization', `Bearer ${jwtAccessToken}`)
          expect(statusCode).toBe(201)
          expect(body.title).toBe(updatedTicketInput.title)
          expect(body.category).toBe(updatedTicketInput.category)
          expect(body.status).toBe(updatedTicketInput.status)
          expect(body.priority).toBe(updatedTicketInput.priority)
          // expect(body.created_by).toBe(authenticatedUserId)
        })
      })

      describe('User tries to create a new ticket without providing mandatory fields', () => {
        it('Should return a 400 Bad Request status code with an error message indicating which fields are missing', async () => {
          const { statusCode, body } = await request(app)
            .post(ticketEndpoints.tickets)
            .send({})
            .set('Authorization', `Bearer ${jwtAccessToken}`)

          expect(statusCode).toBe(400)
          expect(body).toHaveProperty('errors')

          // Assert that title and status field is missing
          expect(body.errors).toHaveProperty('title')
          expect(body.errors.title).toBe('Title is required')
          expect(body.errors).toHaveProperty('category')
          expect(body.errors.category).toBe('An existing category is required')
          expect(body.errors).toHaveProperty('status')
          expect(body.errors.status).toBe('A valid status is required')
          expect(body.errors).toHaveProperty('priority')
          expect(body.errors.priority).toBe('Priority field is required')
        })
      })

      describe('User tries to create a new ticket with an invalid category', () => {
        it('Should return 400 Bad Request status code with an error message indicating that the category field is invalid', async () => {
          const updatedTicketInput = { ...ticketInput, category: '123456789102' }
          const { statusCode, body } = await request(app)
            .post(ticketEndpoints.tickets)
            .send(updatedTicketInput)
            .set('Authorization', `Bearer ${jwtAccessToken}`)
          expect(statusCode).toBe(400)
          expect(body).toHaveProperty('errors')
          expect(body.errors.details).toBe('An existing category is required')
        })
      })

      describe('User tries to create a new ticket with an invalid priority', () => {
        it('Should return a 400 Bad Request status code with an error message indicating that the priority field is invalid', async () => {
          const updatedTicketInput = { ...ticketInput, category: createdCategories[1], priority: '123wrongpriority' }
          const { statusCode, body } = await request(app)
            .post(ticketEndpoints.tickets)
            .send(updatedTicketInput)
            .set('Authorization', `Bearer ${jwtAccessToken}`)
          expect(statusCode).toBe(400)
          expect(body).toHaveProperty('errors')
          expect(body.errors).toHaveProperty('priority')
        })
      })

      describe('User tries to create a new ticket with an invalid status', () => {
        it('Should return a 400 Bad Request status code with an error message indicating that the status field is invalid', async () => {
          const updatedTicketInput = { ...ticketInput, category: createdCategories[1], status: '123wrongpriority' }
          const { statusCode, body } = await request(app)
            .post(ticketEndpoints.tickets)
            .send(updatedTicketInput)
            .set('Authorization', `Bearer ${jwtAccessToken}`)
          expect(statusCode).toBe(400)
          expect(body).toHaveProperty('errors')
          expect(body.errors).toHaveProperty('status')
        })
      })
    })

    describe('An unauthorized user tries to create a new tickets', () => {
      it('Should return a 401 Unauthorized user status code, indicating that the user is not authenticated', async () => {
        const updatedTicketInput = { ...ticketInput, category: createdCategories[0] }
        const { statusCode, body } = await request(app)
          .post(ticketEndpoints.tickets)
          .send(updatedTicketInput)
        expect(statusCode).toBe(400)
        expect(body).toBe('Authentication credentials were not provided.')
      })
    })
  })

  describe('Retrieving and listing tickets', () => {
    describe('Authorized user tests', () => {
      // Sample tickets
      let createdTickets: any = []
      /*
        Creating 100 tickets before each test of this suit
        OBS: The tickets collection is cleared after each test
      */
      beforeEach(async () => {
        const ticketNumber = 100
        for (let counter = 0; counter < ticketNumber; counter++) {
          const randomIndex = Math.floor(Math.random() * createdCategories.length)
          const category = createdCategories[randomIndex]
          const updatedTicketInput = { ...ticketInput, category }
          const { body: createdTicketBody } = await request(app)
            .post(ticketEndpoints.tickets)
            .send(updatedTicketInput)
            .set('Authorization', `Bearer ${jwtAccessToken}`)
          createdTickets.push(createdTicketBody)
        }
      })

      afterEach(async () => {
        // OBS: The tickets collection is cleared after each test
        createdTickets = []
      })

      describe('An authorized user tries to retrieve a pagineted list of tickets', () => {
        it('Should return a 200 status code and an array of tickets in the response body', async () => {
          const { body, statusCode } = await request(app)
            .get(ticketEndpoints.tickets)
            .set('Authorization', `Bearer ${jwtAccessToken}`)
          expect(statusCode).toBe(200)
          expect(body.data).toBeInstanceOf(Array)
          expect(body.data.length).toBeGreaterThan(0)
        })

        it('Should support pagination and return the specified number of tickets per page', async () => {
          const { body, statusCode } = await request(app)
            .get(ticketEndpoints.tickets)
            .set('Authorization', `Bearer ${jwtAccessToken}`)
          const itemsPerPage = body.meta.totalItems / body.meta.totalPages
          expect(body.meta.totalPages).toBe(10)
          expect(statusCode).toBe(200)
          expect(body.data.length).toBe(itemsPerPage)
        })

        // TO-DO
        // it('Should allow filtering tickets by status, category, or other criteria', () => { })

        it('Should have links, meta, and data properties in the response body', async () => {
          const { body } = await request(app)
            .get(categoryEndpoints.categories)
            .set('Authorization', `Bearer ${jwtAccessToken}`)
          expect(body).toHaveProperty('links')
          expect(body).toHaveProperty('meta')
          expect(body).toHaveProperty('data')
        })

        it('Should support pagination and return the specified number of categories per page', async () => {
          const { statusCode, body } = await request(app)
            .get(ticketEndpoints.tickets)
            .set('Authorization', `Bearer ${jwtAccessToken}`)
          const itemsPerPage = body.meta.totalItems / body.meta.totalPages
          expect(body.meta.totalPages).toBe(10)
          expect(statusCode).toBe(200)
          expect(body.data.length).toBe(itemsPerPage)
        })

        it('Should support pagination displaying different pages', async () => {
          const { statusCode, body } = await request(app)
            .get(`${ticketEndpoints.tickets}?page=2`)
            .set('Authorization', `Bearer ${jwtAccessToken}`)
          const itemsPerPage = body.meta.totalItems / body.meta.totalPages
          expect(body.meta.totalPages).toBe(10)
          expect(statusCode).toBe(200)
          expect(body.data.length).toBe(itemsPerPage)
        })

        it('Should support pagination displaying different pages with different limits', async () => {
          const { statusCode, body } = await request(app)
            .get(`${ticketEndpoints.tickets}?page=2&limit=3`)
            .set('Authorization', `Bearer ${jwtAccessToken}`)
          // Number of pages when there's 3 items per page = 34 page
          expect(body.meta.totalPages).toBe(34)
          expect(statusCode).toBe(200)
          expect(body.data.length).toBe(3)
        })
      })

      describe('An authorized user tries to retrieve a specific ticket', () => {
        it('Should return a 200 status code, with the specified ticket on the response body', async () => {
          const ticketId = createdTickets[0]._id
          const { statusCode, body } = await request(app)
            .get(`${ticketEndpoints.tickets}/${ticketId}`)
            .set('Authorization', `Bearer ${jwtAccessToken}`)
          expect(statusCode).toBe(200)
          expect(body.title).toBe(createdTickets[0].title)
          expect(body.category).toHaveProperty('_id')
          expect(body.category).toHaveProperty('title')
          expect(body.category).toHaveProperty('created_by')
          expect(body.status).toBe(createdTickets[0].status)
          expect(body.priority).toBe(createdTickets[0].priority)
        })

        it('Should handle non-existent ticket IDs with a 404 status code', async () => {
          const ticketId = '1029348029348'
          const { statusCode, body } = await request(app)
            .get(`${ticketEndpoints.tickets}/${ticketId}`)
            .set('Authorization', `Bearer ${jwtAccessToken}`)
          expect(body).toBe('Ticket not found')
          expect(statusCode).toBe(404)
        })
      })

      describe('An unauthorized user tries to retrieve a specific ticket', () => {
        it('Should return a 401 Unauthorized status code', async () => {
          const updatedTicketInput = { ...ticketInput, category: createdCategories[0] }
          const { statusCode, body } = await request(app)
            .post(ticketEndpoints.tickets)
            .send(updatedTicketInput)
          expect(statusCode).toBe(400)
          expect(body).toBe('Authentication credentials were not provided.')
        })
      })
    })

    describe('An unauthorized user tries to retrieve a pagineted list of tickets', () => {
      it('Should return a 401 Unauthorized user status code, indicating that the user is not authenticated', async () => {
        const { statusCode, body } = await request(app)
          .get(ticketEndpoints.tickets)
        expect(statusCode).toBe(400)
        expect(body).toBe('Authentication credentials were not provided.')
      })
    })
  })

  describe('Updating existing ticket', () => {
    describe('Authorized user tests', () => {
      // Sample tickets
      let createdTickets: any = []

      /*
        Creating 10 tickets before each test of this suite
        OBS: The tickets collection is cleared after each test
      */
      beforeEach(async () => {
        const ticketNumber = 10
        for (let counter = 0; counter < ticketNumber; counter++) {
          const randomIndex = Math.floor(Math.random() * createdCategories.length)
          const category = createdCategories[randomIndex]
          const updatedTicketInput = { ...ticketInput, category }
          const { body: createdTicketBody } = await request(app)
            .post(ticketEndpoints.tickets)
            .send(updatedTicketInput)
            .set('Authorization', `Bearer ${jwtAccessToken}`)
          createdTickets.push(createdTicketBody)
        }
      })

      afterEach(async () => {
        // OBS: The tickets collection is cleared after each test
        createdTickets = []
      })

      describe('Authorized User Updates an Existing Ticket', () => {
        it('Should return a 200 status code with updated ticket details in the response body', async () => {
          const ticketToBeUpdated = createdTickets[4]

          const newTicket = {
            title: 'Updated web site',
            category: createdCategories[2],
            status: statusOptions[1],
            priority: priorityOptions[2]
          }

          const { statusCode, body } = await request(app)
            .put(`${ticketEndpoints.tickets}/${ticketToBeUpdated._id}`)
            .send(newTicket)
            .set('Authorization', `Bearer ${jwtAccessToken}`)

          const { body: categoryBody } = await request(app)
            .get(`${categoryEndpoints.categories}/${createdCategories[2]}`)
            .set('Authorization', `Bearer ${jwtAccessToken}`)

          expect(statusCode).toBe(200)
          expect(body.title).toBe(newTicket.title)
          expect(body.category).toBe(categoryBody._id)
          expect(body.status).toBe(newTicket.status)
          expect(body.priority).toBe(newTicket.priority)
          // expect(body.created_by).toBe(authenticatedUserId)
        })
      })

      describe('Updating a Non-Existent Ticket', () => {
        it('should return a 404 status code with an informative message', async () => {
          const newTicket = {
            title: 'Updated web site',
            category: createdCategories[2],
            status: statusOptions[1],
            priority: priorityOptions[2]
          }
          const { statusCode, body } = await request(app)
            .put(`${ticketEndpoints.tickets}/someid`)
            .send(newTicket)
            .set('Authorization', `Bearer ${jwtAccessToken}`)
          expect(statusCode).toBe(404)
          expect(body).toBe('Ticket not found')
        })
      })
    })

    describe('Unauthorized User Tries to Update an Existing Ticket', () => {
      it('should return a 401 Unauthorized status code', async () => {
        const newTicket = {
          title: 'Updated web site',
          category: createdCategories[2],
          status: statusOptions[1],
          priority: priorityOptions[2]
        }
        const { statusCode, body } = await request(app)
          .put(`${ticketEndpoints.tickets}/someid`)
          .send(newTicket)
        expect(statusCode).toBe(400)
        expect(body).toBe('Authentication credentials were not provided.')
      })
    })
  })

  describe('Deleting ticket', () => {
    describe('Authorized user tests', () => {
      // Sample tickets
      let createdTickets: any = []

      /*
        Creating 10 tickets before each test of this suite
        OBS: The tickets collection is cleared after each test
      */
      beforeEach(async () => {
        const ticketsNumber = 10
        for (let counter = 0; counter < ticketsNumber; counter++) {
          const randomIndex = Math.floor(Math.random() * createdCategories.length)
          const category = createdCategories[randomIndex]
          const updatedTicketInput = { ...ticketInput, category }
          const { body: createdTicketBody } = await request(app)
            .post(ticketEndpoints.tickets)
            .send(updatedTicketInput)
            .set('Authorization', `Bearer ${jwtAccessToken}`)
          createdTickets.push(createdTicketBody)
        }
      })

      afterEach(async () => {
        // OBS: The tickets collection is cleared after each test
        createdTickets = []
      })

      describe('Authorized User Deletes an Existing Ticket', () => {
        it('should return a 200 status code with a success message in the response body', async () => {
          const ticketToBeDeleted = createdTickets[0]

          const { statusCode, body } = await request(app)
            .delete(`${ticketEndpoints.tickets}/${ticketToBeDeleted._id}`)
            .set('Authorization', `Bearer ${jwtAccessToken}`)

          expect(statusCode).toBe(200)
          expect(body.deletedCount).toBe(1)

          // Checking the existense of the deleted category
          const { statusCode: deletedTicketStatusCode, body: deletedTicketBody } = await request(app)
            .get(`${ticketEndpoints.tickets}/${ticketToBeDeleted._id}`)
            .set('Authorization', `Bearer ${jwtAccessToken}`)

          expect(deletedTicketBody).toStrictEqual('Ticket not found')
          expect(deletedTicketStatusCode).toBe(404)
        })
      })

      describe('Deleting a Non-Existent Ticket', () => {
        it('should return a 404 status code with an informative message', async () => {
          const { statusCode, body } = await request(app)
            .delete(`${ticketEndpoints.tickets}/nonexistingticket`)
            .set('Authorization', `Bearer ${jwtAccessToken}`)
          expect(statusCode).toBe(404)
          expect(body).toBe('Ticket not found')
        })
      })
    })
    describe('Unauthorized User Attempts to Delete an Existing Ticket', () => {
      it('should return a 401 Unauthorized status code', async () => {
        const { statusCode, body } = await request(app)
          .delete(`${ticketEndpoints.tickets}/someticketid`)
        expect(statusCode).toBe(400)
        expect(body).toBe('Authentication credentials were not provided.')
      })
    })
  })
})
