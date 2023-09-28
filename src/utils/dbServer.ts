import { MONGO_DB_URL } from '../config'
import mongoose from 'mongoose'

export const dbConnect = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGO_DB_URL)
  } catch (err) {
    console.log('Error trying to connect to db')
  }
}
