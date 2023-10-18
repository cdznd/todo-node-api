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
  status: {
    type: String,
    enum: ['In Progress', 'Todo', 'In Requirements'],
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
    const category = await CategoryModel.findById(this.category);
    if (!category) {
      throw new Error('An existing category is required');
    }
    next()
  } catch (error) {
    next(error)
  }
});

export const TicketModel = mongoose.model<TicketDocumentInterface, TicketModelInterface>('Ticket', TicketSchema)
