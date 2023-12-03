import mongoose from 'mongoose'
import { MONGO_DB_URL } from '../config/db.config'

export const dbConnect = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGO_DB_URL)
    console.log(`Mongoose Database is running on ${MONGO_DB_URL}`)
  } catch (err) {
    console.log('Error trying to connect to DB')
    console.log(`URL: ${MONGO_DB_URL}`)
  }
}
