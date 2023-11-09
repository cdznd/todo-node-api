import { Router, type RequestHandler } from 'express'
import { requireAuth } from '../middleware/authMiddleware'
import { createCategory, listCategories, getCategory, updateCategory, deleteCategory } from '../controllers/categoryController'
import { categoryEndpoints } from '../config/endpoints'

const router = Router()

/**
 * @openapi
 * paths:
 *  /categories:
 *    post:
 *      tags:
 *       - Category
 *      summary: Create a new Category
 *      description: Create a new Category
 *      security:
 *        - cookieAuth: []
 *      requestBody:   # OpenAPI 3.0 provides the requestBody keyword to describe request bodies.
 *        description: A JSON object containing a valid title.
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                title:
 *                  type: string
 *              example:
 *                title: Web Project
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
 *        #401:
 *          #$ref: '#/components/responses/UnauthorizedError'
 */
router.post(categoryEndpoints.categories, requireAuth, createCategory as RequestHandler)
// READ
// // List Categories
router.get(categoryEndpoints.categories, requireAuth, listCategories as RequestHandler)
// // Specific Category
router.get('/categories/:id', requireAuth, getCategory as RequestHandler)
// UPDATE
router.put('/categories/:id', requireAuth, updateCategory as RequestHandler)
// DELETE
router.delete('/categories/:id', requireAuth, deleteCategory as RequestHandler)

export const categoryRoutes = router
