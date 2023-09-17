import { Router, Request, Response } from "express";
import { signup, login, logout } from "../controllers/authController";

const router = Router()

router.post('/signup', signup)

router.post('/login', login)

router.get('/test', (req: Request, res: Response) => {

    const token = req.cookies.jwt
    
    res.json({token})

});

router.get('/logout', logout)

export const authRoutes = router