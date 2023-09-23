import mongoose from 'mongoose'
import { app } from '../app'
import request from 'supertest'

describe('Authentication Routes', () => {
    // describe('User Signin', () => {
    //     it('User provide valid email and password to SignIn', async () => {
    //         await request(app).get(`/login`).expect(200);
    //     })
    // })
    describe('User Login', () => {

        it('User attempts to login with username and password that do not match', async () => {

            await request(app)
                .post(`/login`)
                .send({
                    email: 'no-account@email.com',
                    password: '0129380123'
                })
                .set('Accept', 'application/json')
                .expect(404)

            // console.log('status code');
            // console.log(statusCode);

        })
    })
});

afterAll(() => mongoose.disconnect())