import { createTicket, listTickets, getTicket, deleteTicket, updateTicket } from '../controllers/ticketController'
import { type RequestHandler, Router } from 'express'
import { requireAuth } from '../middleware/authMiddleware'
import { ticketEndpoints } from '../config/endpoints'

const router = Router()

/**
* @openapi
* /tickets:
*  post:
*     tags:
*     - Ticket
*     summary: Create a new Ticket
*     description: Creates a new ticket and responds responds with 201 statud code and the succefully created ticket.
*     responses:
*       201:
*         description: Ticket Successfully Created
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/User'
*       400:
*         description: Bad Request
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/User'
*/
router.post(ticketEndpoints.tickets, requireAuth, createTicket as RequestHandler)

/**
* @openapi
* /tickets:
*   post:
*     tags:
*       - Ticket
*     summary: Create a new Ticket
*     description: Creates a new ticket and responds with a 201 status code along with the successfully created ticket.
*     security:
*       - cookieAuth: []
*     responses:
*       201:
*         description: Ticket Successfully Created
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Ticket'  # Use the Ticket schema definition
*       400:
*         description: Bad Request
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Ticket'  # Use the Ticket schema definition
*/
router.get(ticketEndpoints.tickets, requireAuth, listTickets as RequestHandler)

/**
 * openapi
 * /tickets:
 *   get:
 *      description: Welcome to swagger-jsdoc!
 *      responses:
 *          200:
 *              description: Success.
 *              content:
 *                  application/json:
 *                      schema:
 *          400:
 *              description: Bad Request
 */
router.get(`${ticketEndpoints.tickets}/:ticketId`, requireAuth, getTicket as RequestHandler)

/**
 * openapi
 * /tickets:
 *   get:
 *     description: Welcome to swagger-jsdoc!
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 */
router.put(`${ticketEndpoints.tickets}/:ticketId`, requireAuth, updateTicket as RequestHandler)

/**
 * openapi
 * /tickets:
 *   get:
 *     description: Welcome to swagger-jsdoc!
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 */
router.delete(ticketEndpoints.deleteTicket, requireAuth, deleteTicket as RequestHandler)

export const ticketRoutes = router
