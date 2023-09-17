import { Router, type RequestHandler } from 'express'
import { signup, login, logout } from '../controllers/authController'

const router = Router()

router.post('/signup', signup as RequestHandler)
router.post('/login', login as RequestHandler)
router.get('/logout', logout as RequestHandler)

export const authRoutes = router
