import { type Request, type Response, type NextFunction } from 'express'
import { handleValidationErrors } from '../utils/index'

export const handleErrors = (err: any, req: Request, res: Response, next: NextFunction): void => {
  if (err.name === 'ValidationError') {
    const errors = handleValidationErrors(err)
    res.status(400).json({ errors })
  } else {
    res.status(400).json({ errors: { details: err.message } })
  }
}
