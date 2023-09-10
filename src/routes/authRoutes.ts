import { Router, Response, Request } from "express";

const router = Router()

router.get('/signup', (req: Request, res: Response) => {
    res.send('SignUp')
})

router.get('/login', (req: Request, res: Response) => {
    res.send('Login')
})

export const authRoutes = router