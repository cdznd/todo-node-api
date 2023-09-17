import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { JWT_SECRET_KEY } from '../config';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt;

    if(token){

        jwt.verify(token, JWT_SECRET_KEY, (err: any, decodedToken: string) => {
            if(err) {
                res.status(400).json({ error: 'error during token vefirication' });
            } else {
                console.log('1')
                console.log(decodedToken);
                next();
            }
        })

    }else{
        res.status(400).json({ error: 'error token not found' })
    }

}