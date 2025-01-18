import mongoose, { type Model, type ObjectId, Schema } from 'mongoose'
import { CategoryModel } from './Category'
import { UserModel } from './User'

interface TicketDocumentInterface extends Document {
  name: string
  category: string
  status: string
  priority: string
  user_id: ObjectId
}

interface TicketModelInterface extends Model<TicketDocumentInterface> {
}

/**
 * @openapi
 * components:
 *   schemas:
 *     Ticket:
 *       type: object
 *       required:
 *         - title
 *         - category
 *         - status
 *         - priority
 *         - created_by
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the ticket.
 *         category:
 *           type: string
 *           description: The category of the ticket, referring to an existing category.
 *         status:
 *           type: string
 *           enum:
 *             - In Progress
 *             - Todo
 *             - In Requirements
 *           description: The status of the ticket, must be one of the predefined values.
 *         priority:
 *           type: string
 *           enum:
 *             - Low
 *             - Medium
 *             - High
 *             - Critical
 *           description: The priority of the ticket, must be one of the predefined values.
 *         created_by:
 *           type: string
 *           description: The user who created the ticket, referring to an existing user.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time the ticket was created.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time the ticket was last updated.
 *   example:
 *     title: Sample Ticket
 *     category: 5fE_asz // Category ObjectId
 *     status: Todo
 *     priority: Medium
 *     created_by: d5fE_asz // User ObjectId
 *     createdAt: 2023-11-05T12:34:56.789Z
 *     updatedAt: 2023-11-05T12:34:56.789Z
 */
const TicketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required']
  },
  category: {
    type: Schema.ObjectId,
    ref: CategoryModel,
    required: [true, 'An existing category is required']
  },
  description: {
    type: String,
    required: [true, 'Ticket needs a description']
  },
  status: {
    type: String,
    enum: ['In Progress', 'In Requirements', 'To do'],
    required: [true, 'A valid status is required']
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    required: [true, 'Priority field is required']
  },
  created_by: {
    type: Schema.ObjectId,
    ref: UserModel,
    required: [true, 'Must be logged in to create a ticket']
  }
},
{
  timestamps: true
})

TicketSchema.pre('save', async function (next) {
  try {
    const category = await CategoryModel.findById(this.category)
    if (!category) {
      throw new Error('An existing category is required')
    }
    next()
  } catch (error) {
    next(error)
  }
})

export const TicketModel = mongoose.model<TicketDocumentInterface, TicketModelInterface>('Ticket', TicketSchema)
