import { Router, type RequestHandler, type Response, type Request } from 'express'
import { requireAuth } from '../middleware/authMiddleware'
import { createCategory, listCategories, getCategory, updateCategory, deleteCategory } from '../controllers/categoryController'
import { categoryEndpoints } from '../config/endpoints'

const router = Router()

// CREATE
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