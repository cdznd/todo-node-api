import { createTicket, listTickets, getTicket } from '../controllers/ticketController'
import { Router } from 'express'
import { requireAuth } from '../middleware/authMiddleware'

const router = Router()

// CREATE
router.post('/tickets', requireAuth, createTicket)
// READ
router.get('/tickets', requireAuth, listTickets)
// UPDATE
router.get('/tickets/:ticketId', requireAuth, getTicket)
// DELETE

// router.put('/tickets/{id}', )
// router.delete('/tickets/{id}', )

export const ticketRoutes = router
