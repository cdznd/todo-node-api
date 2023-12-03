import { config } from 'dotenv'
config({ path: './.env' })

export const PORT = process.env.PORT ?? ''
export const SECRET_KEY = process.env.SECRET_KEY ?? ''
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY ?? ''
