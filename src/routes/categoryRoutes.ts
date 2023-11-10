import { Router, type RequestHandler } from 'express'
import { requireAuth } from '../middleware/authMiddleware'
import { createCategory, listCategories, getCategory, updateCategory, deleteCategory } from '../controllers/categoryController'
import { categoryEndpoints } from '../config/endpoints'

const router = Router()

/**
 * @openapi
 * components:
 *  schemas:
 *    PaginateResults:
 *      type: object
 *      properties:
 *        links:
 *          type: object
 *          properties:
 *            prev:
 *              type: string
 *            next:
 *              type: string
 *        meta:
 *          type: object
 *          properties:
 *            totalItems:
 *              type: integer
 *            totalPages:
 *              type: integer
 *            page:
 *              type: integer
 *        data:
 *          type: array
 *          items:
 *            type: object
 *            properties:
 *              _id:
 *                type: string
 *              title:
 *                type: string
 *              created_by:
 *                type: string
 *              createdAt:
 *                type: string
 *                format: date-time
 *              updatedAt:
 *                type: string
 *                format: date-time
 *              __v:
 *                type: integer
 */


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
 *            Category is succefully created, the Category JSON is returned on the response body
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Category'
 */
router.post(categoryEndpoints.categories, requireAuth, createCategory as RequestHandler)

/**
 * @openapi
 * paths:
 *  /categories:
 *    get:
 *      tags:
 *       - Category
 *      summary: List Categories
 *      description: A paginated list of Categories
 *      security:
 *        - cookieAuth: []
 *      parameters:
 *        - name: page
 *          in: query
 *          description: Page number
 *          required: false
 *          type: integer
 *        - name: limit
 *          in: query
 *          description: Items per page / limit of items per page
 *          required: false
 *          type: integer
 *      responses:
 *        200:
 *          description: >
 *            Successfully returned a paginated list of Categories.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/PaginateResults'
 */
router.get(categoryEndpoints.categories, requireAuth, listCategories as RequestHandler)

router.get('/categories/:id', requireAuth, getCategory as RequestHandler)
// UPDATE
router.put('/categories/:id', requireAuth, updateCategory as RequestHandler)
// DELETE
router.delete('/categories/:id', requireAuth, deleteCategory as RequestHandler)

export const categoryRoutes = router
