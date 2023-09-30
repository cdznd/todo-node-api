import { createTicket, listTickets, getTicket, deleteTicket, updateTicket } from '../controllers/ticketController'
import { Router } from 'express'
import { requireAuth } from '../middleware/authMiddleware'
import { ticketEndpoints } from '../config/endpoints'

const router = Router()

// CREATE
router.post(ticketEndpoints.tickets, requireAuth, createTicket)
// READ
router.get(ticketEndpoints.tickets, requireAuth, listTickets)
// UPDATE
router.put(ticketEndpoints.updateTicket, requireAuth, updateTicket)
// DELETE
router.delete(ticketEndpoints.deleteTicket, requireAuth, deleteTicket)


export const ticketRoutes = router
