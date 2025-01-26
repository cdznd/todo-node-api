import { config } from 'dotenv'
config({ path: './.env' })

// APP
export const PORT = process.env.PORT ?? ''

// JWT
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY ?? ''

export const JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET ?? ''
export const JWT_REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET ?? ''

export const JWT_ACCESS_TOKEN_TTL = process.env.JWT_ACCESS_TOKEN_TTL ?? ''
export const JWT_REFRESH_TOKEN_TTL = process.env.JWT_ACCESS_TOKEN_TTL ?? ''
