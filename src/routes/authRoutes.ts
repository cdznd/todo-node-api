import { Router, type RequestHandler, type Response, type Request } from 'express'
import { signup, login, logout, testing } from '../controllers/authController'
import { requireAuth } from '../middleware/authMiddleware'
import { authEndpoints } from '../config/endpoints'

const router = Router()

router.post(authEndpoints.signup, signup as RequestHandler)
router.post(authEndpoints.login, login as RequestHandler)
router.get(authEndpoints.logout, requireAuth, logout as RequestHandler)

router.get('/check_authentication', requireAuth, (req: Request, res: Response) => {
  const user = res.locals.user
  res.status(200).json({ message: `Currently logged with user ${user.name}, email: ${user.email}` })
})

export const authRoutes = router
