import mongoose, { type Document, Schema } from 'mongoose'
import { UserModel } from './User'

interface CategoryDocumentInterface extends Document {
  title: string
}

/**
 * @openapi
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - title
 *         - created_by
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the category.
 *         created_by:
 *           type: string
 *           description: The user who created the category, referring to an existing user.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time the category was created.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time the category was last updated.
 *   example:
 *     title: Sample Category
 *     created_by: d5fE_asz // User ObjectId
 *     createdAt: 2023-11-05T12:34:56.789Z
 *     updatedAt: 2023-11-05T12:34:56.789Z
 */
const CategorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title field is required']
  },
  created_by: {
    type: Schema.ObjectId,
    ref: UserModel,
    required: [true, 'Must be logged in to create a ticket']
  }
}, {
  timestamps: true
})

export const CategoryModel = mongoose.model<CategoryDocumentInterface>('Category', CategorySchema)
