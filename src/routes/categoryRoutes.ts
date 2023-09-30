import { Router, type RequestHandler, type Response, type Request } from 'express'
import { requireAuth } from '../middleware/authMiddleware'
import { createCategory, listCategories } from '../controllers/categoryController'
import { categoryEndpoints } from '../config/endpoints'

const router = Router()

// CREATE
router.post(categoryEndpoints.categories, requireAuth, createCategory as RequestHandler)
// READ
// // List Categories
router.get(categoryEndpoints.categories, requireAuth, listCategories as RequestHandler)
// // Specific Category
router.get('/categories/:id', requireAuth, () => {})
// UPDATE
router.put('/categories/:id', requireAuth, () => {})
// DELETE
router.delete('categories/:id', requireAuth, () => {})

export const categoryRoutes = router