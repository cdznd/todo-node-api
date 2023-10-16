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
    required: [true, 'Status is required']
  },
  priority: {
    type: String,
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

export const TicketModel = mongoose.model<TicketDocumentInterface, TicketModelInterface>('Ticket', TicketSchema)
