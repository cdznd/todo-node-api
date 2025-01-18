import { createTicket, listTickets, getTicket, deleteTicket, updateTicket } from '../controllers/ticketController'
import { type RequestHandler, Router } from 'express'
import { ticketEndpoints } from '../config/endpoints'

const router = Router()

/**
 * @openapi
 * components:
 *  schemas:
 *    TicketPaginateResults:
 *      type: object
 *      properties:
 *        links:
 *          type: object
 *          properties:
 *            prev:
 *              type: string
 *            next:
 *              type: string
 *        meta:
 *          type: object
 *          properties:
 *            totalItems:
 *              type: integer
 *            totalPages:
 *              type: integer
 *            page:
 *              type: integer
 *        data:
 *          type: array
 *          items:
 *            type: object
 *            properties:
 *              _id:
 *                type: string
 *              title:
 *                type: string
 *              category:
 *                type: string
 *              status:
 *                type: string
 *              priority:
 *                type: string
 *              created_by:
 *                type: string
 *              createdAt:
 *                type: string
 *                format: date-time
 *              updatedAt:
 *                type: string
 *                format: date-time
 *              __v:
 *                type: integer
 */

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
 *      requestBody:
 *        description: A JSON object containing a valid data for the Ticket creation.
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
router.post(ticketEndpoints.tickets, createTicket as RequestHandler)

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
 *                $ref: '#/components/schemas/TicketPaginateResults'
 */
router.get(ticketEndpoints.tickets, listTickets as RequestHandler)

/**
 * @openapi
 * paths:
 *  /tickets/{id}:
 *    get:
 *      tags:
 *       - Ticket
 *      summary: Get Ticket by ID
 *      description: Return the found Ticket JSON on the response
 *      security:
 *        - cookieAuth: []
 *      parameters:
 *        - name: id
 *          in: path
 *          description: Ticket ID
 *          required: true
 *          type: integer
 *      responses:
 *        200:
 *          description: >
 *            Successfully returned the Ticket found.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Ticket'
 */
router.get(`${ticketEndpoints.tickets}/:ticketId`, getTicket as RequestHandler)

/**
 * @openapi
 * paths:
 *  /tickets/{id}:
 *    put:
 *      tags:
 *       - Ticket
 *      summary: Update Ticket
 *      description: Update a Ticket, and return the updated version
 *      security:
 *        - cookieAuth: []
 *      parameters:
 *        - name: id
 *          in: path
 *          description: Ticket ID
 *          required: true
 *          type: integer
 *      requestBody:
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
 *                title: New Task
 *                category: '654ad042e3fdf769e0199371'
 *                status: 'In Progress'
 *                priority: 'High'
 *      responses:
 *        200:
 *          description: >
 *            Ticket is successfully updated, the new Ticket version is returnd as a JSON in the response.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Ticket'
 *        404:
 *          description: >
 *            Ticket not found
 *          content:
 *            text/plain:
 *              schema:
 *                type: string
 *                example: "Ticket not found"
 */
router.put(`${ticketEndpoints.tickets}/:ticketId`, updateTicket as RequestHandler)

/**
 * @openapi
 * paths:
 *  /tickets/{id}:
 *    delete:
 *      tags:
 *       - Ticket
 *      summary: Delete Ticket by ID
 *      description: Found and Ticket By ID and delete it.
 *      security:
 *        - cookieAuth: []
 *      parameters:
 *        - name: id
 *          in: path
 *          description: Ticket ID
 *          required: true
 *          type: integer
 *      responses:
 *        200:
 *          description: >
 *            Ticket successfully deleted.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  acknowledged:
 *                    type: bool
 *                  deletedCount:
 *                    type: integer
 *        404:
 *          description: >
 *            Ticket not found
 *          content:
 *            text/plain:
 *              schema:
 *                type: string
 *                example: "Ticket not found"
 */
router.delete(ticketEndpoints.deleteTicket, deleteTicket as RequestHandler)

export const ticketRoutes = router
