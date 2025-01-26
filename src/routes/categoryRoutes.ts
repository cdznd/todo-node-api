import { Router, type RequestHandler } from 'express'
import { createCategory, listCategories, getCategory, updateCategory, deleteCategory } from '../controllers/categoryController'
import { categoryEndpoints } from '../config/endpoints'

const router = Router()

/**
 * @openapi
 * components:
 *  schemas:
 *    CategoryPaginateResults:
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
 *      requestBody:
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
router.post(categoryEndpoints.categories, createCategory as RequestHandler)

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
 *                $ref: '#/components/schemas/CategoryPaginateResults'
 */
router.get(categoryEndpoints.categories, listCategories as RequestHandler)

/**
 * @openapi
 * paths:
 *  /categories/{id}:
 *    get:
 *      tags:
 *       - Category
 *      summary: Get Category by ID
 *      description: Return the found Category JSON on the response
 *      security:
 *        - cookieAuth: []
 *      parameters:
 *        - name: id
 *          in: path
 *          description: Category ID
 *          required: true
 *          type: integer
 *      responses:
 *        200:
 *          description: >
 *            Successfully returned the Category found.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Category'
 */
router.get('/categories/:id', getCategory as RequestHandler)

/**
 * @openapi
 * paths:
 *  /categories/{id}:
 *    put:
 *      tags:
 *       - Category
 *      summary: Update Category
 *      description: Update a Category, and return the updated version
 *      security:
 *        - cookieAuth: []
 *      parameters:
 *        - name: id
 *          in: path
 *          description: Category ID
 *          required: true
 *          type: integer
 *      requestBody:
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
 *                title: New Web Project
 *      responses:
 *        200:
 *          description: >
 *            Successfully returned the Category found.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Category'
 *        404:
 *          description: >
 *            Category not found
 *          content:
 *            text/plain:
 *              schema:
 *                type: string
 *                example: "Category not found"
 */
router.put('/categories/:id', updateCategory as RequestHandler)

/**
 * @openapi
 * paths:
 *  /categories/{id}:
 *    delete:
 *      tags:
 *       - Category
 *      summary: Delete Category by ID
 *      description: Found and Category By ID and delete it.
 *      security:
 *        - cookieAuth: []
 *      parameters:
 *        - name: id
 *          in: path
 *          description: Category ID
 *          required: true
 *          type: integer
 *      responses:
 *        200:
 *          description: >
 *            Category successfully deleted.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  acknowledged:
 *                    type: bool
 *                  deletedCount:
 *                    type: integer
 *        404:
 *          description: >
 *            Category not found
 *          content:
 *            text/plain:
 *              schema:
 *                type: string
 *                example: "Category not found"
 */
router.delete('/categories/:id', deleteCategory as RequestHandler)

export const categoryRoutes = router
