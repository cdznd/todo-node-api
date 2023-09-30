import mongoose, { type Document, Schema } from "mongoose";

interface CategoryDocumentInterface extends Document {
    title: string
}

const CategorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title field is required']
    },
    user_id: {
        type: Schema.ObjectId,
        required: [true, 'Must be logged in to create a ticket']
    }
},{
    timestamps: true
})

export const CategoryModel = mongoose.model<CategoryDocumentInterface>('Category', CategorySchema)