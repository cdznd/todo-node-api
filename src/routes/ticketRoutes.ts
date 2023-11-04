import { createTicket, listTickets, getTicket, deleteTicket, updateTicket } from '../controllers/ticketController'
import { type RequestHandler, Router } from 'express'
import { requireAuth } from '../middleware/authMiddleware'
import { ticketEndpoints } from '../config/endpoints'

const router = Router()

// CREATE
router.post(ticketEndpoints.tickets, requireAuth, createTicket as RequestHandler)
// LIST
router.get(ticketEndpoints.tickets, requireAuth, listTickets as RequestHandler)
// READ
router.get(`${ticketEndpoints.tickets}/:ticketId`, requireAuth, getTicket as RequestHandler)
// UPDATE
router.put(`${ticketEndpoints.tickets}/:ticketId`, requireAuth, updateTicket as RequestHandler)
// DELETE
router.delete(ticketEndpoints.deleteTicket, requireAuth, deleteTicket as RequestHandler)

export const ticketRoutes = router
