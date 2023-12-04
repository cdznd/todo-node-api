import { Router, type RequestHandler } from 'express'
import { signup, login, logout, refresh } from '../controllers/authController'
import { requireAuth } from '../middleware/authMiddleware'
import { authEndpoints } from '../config/endpoints'

const router = Router()

/**
 * @openapi
 * paths:
 *  /signup:
 *    post:
 *      tags:
 *       - User Authentication
 *      summary: Creates a new user
 *      description: Creates a new user
 *      security: []
 *      requestBody:   # OpenAPI 3.0 provides the requestBody keyword to describe request bodies.
 *        description: A JSON object containing name, valid email and a strong password.
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                email:
 *                  type: string
 *                password:
 *                  type: string
 *              example:
 *                name: John Snow
 *                email: john.snow@gmail.com
 *                password: mypassword123***#
 *      responses:
 *        201:
 *          description: >
 *            User succefully created, the user JSON is returned on the response body
 *            The session ID is returned in a cookie named `JSESSIONID`. You need to include this cookie in subsequent requests.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 *          headers:
 *            Set-Cookie:
 *              schema:
 *                type: string
 *                example: JSESSIONID=abcde12345; Path=/; HttpOnly
 *        409:
 *          description: >
 *            Conflit with an already existing User.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  errors:
 *                    type: object
 *                example:
 *                  errors: { "email": "Account with this email already exists" }
 */
router.post(authEndpoints.signup, signup as RequestHandler)

/**
 * @openapi
 * paths:
 *  /login:
 *    post:
 *      tags:
 *        - User Authentication
 *      summary: Logs in and return the JWT Authentication Cookie
 *      description: Logs in and returns the JWT Authentication Cookie
 *      security: []
 *      requestBody:
 *        description: A JSON object containing the email and password
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  type: string
 *                password:
 *                  type: string
 *              example:
 *                email: john.snow@gmail.com
 *                password: mypassword123***#
 *      responses:
 *        200:
 *          description: >
 *            Successfully authenticated.
 *            The JWT Token is returned in a cookie named 'jwt', and the access Token is returned on the response body.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  accessToken:
 *                    type: string
 *                example:
 *                  accessToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NDgyZWIzYmU4ODdjMjZkZTk3ZjYwZCIsImlhdCI6MTY5OTU0NDYwMCwiZXhwIjoxNjk5NTUxODAwfQ.-CsdpzdG0h4aNSzP9JzrRf6eeDdeZivLVTqU0vi58qc
 *          headers:
 *            Set-Cookie:
 *              schema:
 *                type: string
 *                example: Max-Age=7200; Path=/; Expires=Wed, 08 Nov 2023 01:52:07 GMT; HttpOnly
 *        400:
 *          description: >
 *            Login Failed, email or pass incorrect. Is returned a 400 Bad Request status code and a JSON with the error mensage
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  errors:
 *                    type: object
 *                example:
 *                  errors: { "details": "Incorrect username or password" }
 *
 */
router.post(authEndpoints.login, login as RequestHandler)

/**
 * @openapi
 * paths:
 *  /logout:
 *    get:
 *      tags:
 *        - User Authentication
 *      summary: Logout
 *      description: Logout
 *      security: []
 *      responses:
 *        200:
 *          description: >
 *            Successfully Logout
 *
 */
router.get(authEndpoints.logout, logout as RequestHandler)

/**
 * @openapi
 * paths:
 *  /refresh:
 *    get:
 *      tags:
 *        - User Authentication
 *      summary: Refresh Token
 *      description: Refresh Token
 *      security: []
 *      responses:
 *        200:
 *          description: >
 *            New Access Token generated
 *
 */
router.get('/refresh', refresh as RequestHandler)

export const authRoutes = router
