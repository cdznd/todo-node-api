import { type NextFunction, type Request, type Response } from 'express'
import { TicketModel } from '../models/Ticket'

export const createTicket = async (req: Request, res: Response, next: NextFunction) => {
  const { title, category, status, priority } = req.body
  const currentUser = res.locals.user
  try {
    const ticket = await TicketModel.create({ title, category, status, priority, user_id: currentUser._id })
    res.status(201).json({ ticket })
  } catch (err) {
    next(err)
  }
}

// Needs to add pagination
export const listTickets = async (req: Request, res: Response, next: NextFunction) => {
  const currentUser = res.locals.user
  try {
    const tickets = await TicketModel.find({ user_id: currentUser._id })
    res.status(200).json(tickets)
  } catch (err) {
    next(err)
  }
}

export const getTicket = async (req: Request, res: Response, next: NextFunction) => {
  const { ticketId } = req.params
  const currentUser = res.locals.user
  try {
    const ticket = await TicketModel.findOne({ _id: ticketId, user_id: currentUser._id })
    res.status(200).json(ticket)
  } catch (err) {
    next(err)
  }
}

export const updateTicket = async (req: Request, res: Response, next: NextFunction) => {
  
}

export const deleteTicket = async (req: Request, res: Response, next: NextFunction) => {
  const { ticketId } = req.params
  const currentUser = res.locals.user
  try {
    const ticket = await TicketModel.findOneAndDelete({ _id: ticketId, user_id: currentUser._id })
    res.status(200).json({ msg: 'deleted' })
  } catch (err) {
    next(err)
  }
}
