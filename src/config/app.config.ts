import { config } from 'dotenv'
config({ path: './.env' })

export const PORT = process.env.PORT ?? ''
export const SECRET_KEY = process.env.SECRET_KEY ?? ''

export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY ?? ''

export const JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET ?? ''
export const JWT_REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET ?? ''

export const JWT_ACCESS_TOKEN_TTL = process.env.JWT_ACCESS_TOKEN_TTL ?? '20s'