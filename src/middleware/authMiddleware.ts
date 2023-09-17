import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { JWT_SECRET_KEY } from '../config';
import { getUserById } from '../models/User';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token, JWT_SECRET_KEY, (err: any, decodedToken: string) => {
            if(err) {
                res.status(400).json({ error: 'error during token vefirication' });
            } else {
                next();
            }
        })
    }else{
        res.status(400).json({ error: 'error token not found' })
    }
}

export const checkUser = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token, JWT_SECRET_KEY, async (err: any, decodedToken: any) => {
            if(err) {
                res.status(400).json({ error: 'error during token vefirication' });
            } else {
                const user = await getUserById(decodedToken.id);
                if(user) {
                    res.locals.user = user
                }
                next();
            }
        })
    }else{
        res.locals.user = null
        next()
    }
}