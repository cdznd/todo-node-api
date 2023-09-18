import { Router, type RequestHandler, Request, Response } from 'express'
import { signup, login, logout } from '../controllers/authController'
import { requireAuth } from '../middleware/authMiddleware'

const router = Router()

router.post('/signup', signup as RequestHandler)
router.post('/login', login as RequestHandler)
router.get('/logout', logout as RequestHandler)

router.get('/check_authentication', requireAuth, (req: Request, res: Response) => {
    const user = res.locals.user
    res.json({ message: `Currently logged with user ${user.name}, email: ${user.email}` })
})

export const authRoutes = router
