import mongoose from 'mongoose'
import { createServer } from '../utils/appServer'
import request from 'supertest'
import { MongoMemoryServer } from 'mongodb-memory-server'

let dbServer: any
beforeAll(async () => {
  dbServer = await MongoMemoryServer.create()
  const dbServerURL = await dbServer.getUri()
  await mongoose.connect(dbServerURL)
})

afterEach(async () => {
  await mongoose.connection.collection('users').deleteMany({})
})

const app = createServer()

describe('Tickets Routes', () => {
  describe('Creating a Ticket', () => {
    describe('User tries to create a new ticket providing all valid data.', () => {
      it('Should return a 201 Created status code with the newly created ticket in the response body', () => {

      })
    })

    describe('User tries to create a new ticket without providing mandatory fields', () => {
      it('Should return a 400 Bad Request status code with an error message indicating which fields are missing', () => {

      })
    })

    describe('User tries to create a new ticket with an invalid category', () => {
      it('Should return 400 Bad Request status code with an error message indicating that the category field is invalid', () => {

      })
    })

    describe('User tries to create a new ticket with an invalid priority', () => {
      it('Should return a 400 Bad Request status code with an error message indicating that the priority field is invalid', () => {

      })
    })

    describe('User tries to create a new ticket with an invalid status', () => {
      it('Should return a 400 Bad Request status code with an error message indicating that the status field is invalid', () => {

      })
    })

    describe('An unauthorized user tries to create a new tickets', () => {
      it('Should return a 401 Unauthorized user status code, indicating that the user is not authenticated', () => {

      })
    })
  })

  describe('Retrieving and listing tickets', () => {
    describe('An authorized user retrieves a pagineted list of tickets', () => {
      it('Should return a 200 status code and an array of tickets in the response body', () => {})

      it('Should support pagination and return the specified number of tickets per page', () => {})

      it('Should allow filtering tickets by status, category, or other criteria', () => {})
    })

    // How to we retrieve a specific ticket? byId, email, name?
    describe('An authorized user tries to retrieve a specific ticket', () => {
      it('Should return a 200 status code, with the specified ticket on the response body', () => {

      })

      it('should return a 200 status code and the specified ticket in the response body', () => {})

      it('should retrieve a ticket by its unique ID', () => {})

      it('should retrieve a ticket by its title', () => {})

      it('should retrieve a ticket by the user who created it', () => {})

      it('should handle non-existent ticket IDs with a 404 status code', () => {})
    })

    describe('An unauthorized user tries to retrieve a specific ticket', () => {
      it('Should return a 401 Unauthorized status code', () => {})
      it('Should not allow unauthorized access to ticket details', () => {})
    })

    describe('Retrieving a non-existent ticket', () => {
      it('Should return a 404 status code', () => {})
      it('Should provide an informative message indicating that the ticket does not exist', () => {})
    })
  })

  describe('Updating existing ticket', () => {
    describe('Authorized User Updates an Existing Ticket', () => {
      it('should return a 200 status code with updated ticket details in the response body', async () => {})
    })
    describe('Unauthorized User Tries to Update an Existing Ticket', () => {
      it('should return a 401 Unauthorized status code', async () => {})
    })
    describe('Updating a Non-Existent Ticket', () => {
      it('should return a 404 status code with an informative message', async () => {})
    })
  })

  describe('Deleting ticket', () => {
    describe('Authorized User Deletes an Existing Ticket', () => {
      it('should return a 200 status code with a success message in the response body', () => {

      })
    })

    describe('Unauthorized User Attempts to Delete an Existing Ticket', () => {
      it('should return a 401 Unauthorized status code', () => {

      })
    })

    describe('Deleting a Non-Existent Ticket', () => {
      it('should return a 404 status code with an informative message', () => {

      })
    })
  })
})

afterAll(async () => {
  await mongoose.disconnect()
  await dbServer.stop()
})