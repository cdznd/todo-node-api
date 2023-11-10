import { createTicket, listTickets, getTicket, deleteTicket, updateTicket } from '../controllers/ticketController'
import { type RequestHandler, Router } from 'express'
import { requireAuth } from '../middleware/authMiddleware'
import { ticketEndpoints } from '../config/endpoints'

const router = Router()

/**
 * @openapi
 * paths:
 *  /tickets:
 *    post:
 *      tags:
 *       - Ticket
 *      summary: Create a new Ticket
 *      description: Create a new Ticket
 *      security:
 *        - cookieAuth: []
 *      requestBody:   # OpenAPI 3.0 provides the requestBody keyword to describe request bodies.
 *        description: A JSON object containing a valid title.
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                title:
 *                  type: string
 *                category:
 *                  type: string
 *                status:
 *                  type: string
 *                priority:
 *                  type: string
 *              example:
 *                title: Task
 *                category: '654ad042e3fdf769e0199371'
 *                status: 'In Progress'
 *                priority: 'Low'
 *      responses:
 *        201:
 *          description: >
 *            Ticket is succefully created, the Ticket JSON is returned on the response body
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Ticket'
 */
router.post(ticketEndpoints.tickets, requireAuth, createTicket as RequestHandler)

/**
 * @openapi
 * paths:
 *  /tickets:
 *    get:
 *      tags:
 *       - Ticket
 *      summary: List Tickets
 *      description: Return a paginated list of Tickets
 *      security:
 *        - cookieAuth: []
 *      parameters:
 *        - name: page
 *          in: query
 *          description: Page number
 *          required: false
 *          type: integer
 *        - name: limit
 *          in: query
 *          description: Items per page / limit of items per page
 *          required: false
 *          type: integer
 *      responses:
 *        200:
 *          description: >
 *            Successfully returned a paginated list of Tickets.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/PaginateResults'
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
