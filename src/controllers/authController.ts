import express from 'express';
import { UserModel, getUserByEmail } from '../models/User';
import jwt from 'jsonwebtoken'
import { JWT_SECRET_KEY } from '../config';
import { Types } from 'mongoose';
import bcrypt from 'bcryptjs';

interface Errors {
    errors: {
        name: Error,
        email: Error,
        password: Error,
    },
    message: String,
    code?: String,
}

interface Error {
    properties: any,
    kind: String,
    path: string,
    value?: String,
    reason?: String,
}

const handleErrors = (err: Errors) => {

    let errors: any = {}

    if (err.message.includes('User validation failed')) {
        // msut fix typescript, destructuring
        Object.values(err.errors).forEach(({ path, properties }) => {
            errors[path] = properties.message
        })
    }

    return errors;

}

// 2 hours
const maxAge = 60 * 60 * 2;
const createToken = (id: Types.ObjectId) => {
    return jwt.sign( { id }, JWT_SECRET_KEY, { expiresIn: maxAge } )
}

export const signup = async (req: express.Request, res: express.Response) => {

    const { name, email, password } = req.body;

    try {

        let userAlreadyExists;

        // Check for duplicates
        if(email){
            await getUserByEmail(email).then((item) => {
                if(item){
                    userAlreadyExists = true;
                }
            })
        }

        if(userAlreadyExists){
            res.status(400).json({errors: 'Email already registered in another account'})
        }else{
            // Create new User
            const newUser = await UserModel.create({ name, email, password });
            const token = createToken(newUser._id);
            res.cookie('jwt', token, {
                httpOnly: true,
                maxAge: maxAge * 1000
            });
            res.status(201).json(newUser);
        }

    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({errors: errors})
    }

}

export const login = async (req: express.Request, res: express.Response) => {

    const { email, password } = req.body;

    const user = await getUserByEmail(email);

    if(user){

        // Check password
        // 
        if(bcrypt.hash(password, user.salt)){
            
        }

    }

}