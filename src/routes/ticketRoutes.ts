import { createTicket, listTickets, getTicket } from '../controllers/ticketController'
import { Router } from 'express'
import { requireAuth } from '../middleware/authMiddleware'

const router = Router()

router.post('/tickets', requireAuth, createTicket)
router.get('/tickets', requireAuth, listTickets)
router.get('/tickets/:ticketId', requireAuth, getTicket)

// router.put('/tickets/{id}', )
// router.delete('/tickets/{id}', )

export const ticketRoutes = router