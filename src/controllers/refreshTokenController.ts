import { type Request, type Response } from 'express'
import { UserModel } from 'models/User'


export const refreshTokenController = async (req: Request, res: Response) => {
    // The RefreshToken was set on the cookies
    const cookies = req.cookies
    // Check if jwt cookie was set
    if(!cookies.jwt) return res.sendStatus(400)
    
    const refreshToken = cookies.jwt

    // Clear the current refresh token set

    // Find the user based on the refreshToken set on Cookies
    const user = UserModel.findOne({ refreshToken })
    
}

