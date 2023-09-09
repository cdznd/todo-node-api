import express from 'express';
import bcrypt from 'bcryptjs';

import { createUser, getUserByEmail } from '../models/User';
import { authentication, random } from 'helpers';

export const signUp = async (req: express.Request, res: express.Response) => {

    try{
        
        const { name, email, password } = req.body;

        // Validation for empty values
        if( !name || !email || !password ){
            return res.status(400).send('There is a empty field');
        }

        // Checking Existing Users
        const existingUser = getUserByEmail(email);
        if(existingUser){
            return res.status(400).send('A user with this email already exists');
        }

        // Creating the user
        // const salt = random();
        const user = await createUser({
            name,
            email,
            password: bcrypt.hashSync(password, 8)
        })

        return res.sendStatus(200).json(user).end();

    } catch(error) {
        return res.status(400).send('Some error happened during the creation');
    }
}

const signIn = async () => {
    
}