import { Router, type RequestHandler, Request, Response, NextFunction } from 'express'
import { signup, login, logout, testing } from '../controllers/authController'
import { requireAuth } from '../middleware/authMiddleware'

const router = Router()

router.post('/signup', signup as RequestHandler)
router.post('/login', login as RequestHandler)
router.get('/logout', requireAuth, logout as RequestHandler)

router.get('/check_authentication', requireAuth, (req: Request, res: Response) => {
    const user = res.locals.user
    res.json({ message: `Currently logged with user ${user.name}, email: ${user.email}` })
})

router.get('/testing', testing as RequestHandler)

export const authRoutes = router
