import mongoose, { type Document, Schema } from "mongoose";
import { UserModel } from "./User";

interface CategoryDocumentInterface extends Document {
    title: string
}

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
},{
    timestamps: true
})

export const CategoryModel = mongoose.model<CategoryDocumentInterface>('Category', CategorySchema)