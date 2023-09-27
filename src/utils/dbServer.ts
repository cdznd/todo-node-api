import { MONGO_DB_URL } from "../config";
import mongoose from "mongoose";

export const dbConnect = async () => {
    try {
        mongoose.connect(MONGO_DB_URL)
        console.log('DB Connected')
    } catch(err) {
        console.log('Error trying to connect to db')
    }
}