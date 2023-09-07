import { config } from 'dotenv';
config({ path: './.env' });

export const PORT = process.env.PORT 
export const MONGO_DB_URL = process.env.MONGO_DB_URL