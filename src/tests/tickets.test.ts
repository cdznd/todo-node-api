import mongoose, { ObjectId } from 'mongoose'
import { createServer } from '../utils/appServer'
import request from 'supertest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { ticketEndpoints, authEndpoints, categoryEndpoints } from '../config/endpoints'
import { before } from 'lodash'
import { createTicket } from '../controllers/ticketController'

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
  category: undefined,
  status: statusOptions[0],
  priority: priorityOptions[0]
}

let jwtCookie: any;
let userId: any;
const createdCategories: any = [];

beforeAll(async () => {
  // Creating a new user
  await request(app).post(authEndpoints.signup).send(userInput);
  const { headers, body: user } = await request(app).post(authEndpoints.login).send({
    email: userInput.email,
    password: userInput.password,
  });
  jwtCookie = headers['set-cookie'][0];
  userId = user._id
  // Creating some categories before.
  for (const category of categories) {
    const { body } = await request(app).post(categoryEndpoints.categories).send({ title: category }).set('Cookie', jwtCookie)
    createdCategories.push(body._id)
  }
})

describe('Tickets Routes', () => {

  describe('Creating a Ticket', () => {

    describe('Authorized user tests', () => {

      describe('User tries to create a new ticket providing all valid data.', () => {
        it('Should return a 201 Status code with the newly created ticket in the response body', async () => {
          const updatedTicketInput = { ...ticketInput, category: createdCategories[0] }
          const { statusCode, body } = await request(app)
            .post(ticketEndpoints.tickets)
            .send(updatedTicketInput)
            .set('Cookie', jwtCookie)
          expect(statusCode).toBe(201)
          expect(body.title).toBe(updatedTicketInput.title)
          expect(body.category).toBe(updatedTicketInput.category)
          expect(body.status).toBe(updatedTicketInput.status)
          expect(body.priority).toBe(updatedTicketInput.priority)
          expect(body.created_by).toBe(userId)
        })
      })

      describe('User tries to create a new ticket without providing mandatory fields', () => {
        it('Should return a 400 Bad Request status code with an error message indicating which fields are missing', async () => {

          const { statusCode, body } = await request(app)
            .post(ticketEndpoints.tickets)
            .send({})
            .set('Cookie', jwtCookie)

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
            .set('Cookie', jwtCookie)
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
            .set('Cookie', jwtCookie)
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
            .set('Cookie', jwtCookie)
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

      let createdTickets: any = []

      beforeEach(async () => {
        const tickets_number = 100
        for (let counter = 0; counter < tickets_number; counter++) {
          const randomIndex = Math.floor(Math.random() * createdCategories.length);
          const category = createdCategories[randomIndex]
          const updatedTicketInput = { ...ticketInput, category }
          const { body: createdTicketBody } = await request(app)
            .post(ticketEndpoints.tickets)
            .send(updatedTicketInput)
            .set('Cookie', jwtCookie)
          createdTickets.push(createdTicketBody)
        }
      })

      afterEach(async () => {
        createdTickets = []
      })

      describe('An authorized user retrieves a pagineted list of tickets', () => {

        it('Should return a 200 status code and an array of tickets in the response body', async () => {
          const { body, statusCode } = await request(app)
            .get(ticketEndpoints.tickets)
            .set('Cookie', jwtCookie)
          expect(statusCode).toBe(200)
          expect(body.data).toBeInstanceOf(Array)
          expect(body.data.length).toBeGreaterThan(0)
        })

        it('Should support pagination and return the specified number of tickets per page', async () => {
          const { body, statusCode } = await request(app)
            .get(ticketEndpoints.tickets)
            .set('Cookie', jwtCookie)
          const itemsPerPage = body.meta.totalItems / body.meta.totalPages
          expect(body.meta.totalPages).toBe(10)
          expect(statusCode).toBe(200)
          expect(body.data.length).toBe(itemsPerPage)
        })

        // it('Should allow filtering tickets by status, category, or other criteria', () => { })
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
            .get(ticketEndpoints.tickets)
            .set('Cookie', jwtCookie)
          const itemsPerPage = body.meta.totalItems / body.meta.totalPages
          expect(body.meta.totalPages).toBe(10)
          expect(statusCode).toBe(200)
          expect(body.data.length).toBe(itemsPerPage)

        })

        it('Should support pagination displaying different pages', async () => {
          const { statusCode, body } = await request(app)
            .get(`${ticketEndpoints.tickets}?page=2`)
            .set('Cookie', jwtCookie)
          const itemsPerPage = body.meta.totalItems / body.meta.totalPages
          expect(body.meta.totalPages).toBe(10)
          expect(statusCode).toBe(200)
          expect(body.data.length).toBe(itemsPerPage)

        })

        it('Should support pagination displaying different pages with different limits', async () => {
          const { statusCode, body } = await request(app)
            .get(`${ticketEndpoints.tickets}?page=2&limit=3`)
            .set('Cookie', jwtCookie)
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
            .set('Cookie', jwtCookie)          
          expect(statusCode).toBe(200)
          expect(body.title).toBe(createdTickets[0].title)
          expect(body.category).toHaveProperty('_id')
          expect(body.category).toHaveProperty('title')
          expect(body.category).toHaveProperty('created_by')
          expect(body.status).toBe(createdTickets[0].status)
          expect(body.priority).toBe(createdTickets[0].priority)
        })
  
        it.only('Should handle non-existent ticket IDs with a 404 status code', async () => { 
          const ticketId = '1029348029348'
          const { statusCode, body } = await request(app)
            .get(`${ticketEndpoints.tickets}/${ticketId}`)
            .set('Cookie', jwtCookie)
          expect(body).toBe('Ticket not found')          
          expect(statusCode).toBe(404)
        })

      })
  
      describe('An unauthorized user tries to retrieve a specific ticket', () => {
        it('Should return a 401 Unauthorized status code', () => { })
        it('Should not allow unauthorized access to ticket details', () => { })
      })
  
      describe('Retrieving a non-existent ticket', () => {
        it('Should return a 404 status code', () => { })
        it('Should provide an informative message indicating that the ticket does not exist', () => { })
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

  // describe('Updating existing ticket', () => {
  //   describe('Authorized User Updates an Existing Ticket', () => {
  //     it('should return a 200 status code with updated ticket details in the response body', async () => {})
  //   })
  //   describe('Unauthorized User Tries to Update an Existing Ticket', () => {
  //     it('should return a 401 Unauthorized status code', async () => {})
  //   })
  //   describe('Updating a Non-Existent Ticket', () => {
  //     it('should return a 404 status code with an informative message', async () => {})
  //   })
  // })

  // describe('Deleting ticket', () => {
  //   describe('Authorized User Deletes an Existing Ticket', () => {
  //     it('should return a 200 status code with a success message in the response body', () => {

  //     })
  //   })

  //   describe('Unauthorized User Attempts to Delete an Existing Ticket', () => {
  //     it('should return a 401 Unauthorized status code', () => {

  //     })
  //   })

  //   describe('Deleting a Non-Existent Ticket', () => {
  //     it('should return a 404 status code with an informative message', () => {

  //     })
  //   })
  // })
})

afterAll(async () => {
  await mongoose.disconnect()
  await dbServer.stop()
})