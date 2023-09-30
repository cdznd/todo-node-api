import mongoose, { type Document, Schema } from "mongoose";

interface CategoryDocumentInterface extends Document {
    title: string
}

const CategorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title field is required']
    }
},{
    timestamps: true
})

export const CategoryModel = mongoose.model<CategoryDocumentInterface>('Category', CategorySchema)