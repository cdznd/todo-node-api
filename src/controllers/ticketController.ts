import { type NextFunction, type Request, type Response } from 'express'
import { TicketModel } from '../models/Ticket'
import { paginateResults } from '../utils'
import mongoose from 'mongoose'

export const createTicket = async (req: Request, res: Response, next: NextFunction) => {
  const { title, category, status, priority } = req.body
  const currentUser = res.locals.user
  try {
    const ticket = await TicketModel.create({ title, category, status, priority, created_by: currentUser._id })
    res.status(201).json(ticket)
  } catch (err) {
    next(err)
  }
}

// Needs to add pagination
export const listTickets = async (req: Request, res: Response, next: NextFunction) => {
  const { meta, links, limit, skipOffset } = await paginateResults(TicketModel, req)
  try {
    const tickets = await TicketModel
      .find({})
      .populate('category')
      .skip(skipOffset)
      .limit(limit)
    const responseBody = {
      links,
      meta: {
        totalItems: meta.totalItems,
        totalPages: meta.totalPages,
        page: meta.page,
      },
      data: tickets
    }
    res.status(200).json(responseBody)
  } catch (err) {
    next(err)
  }
}

export const getTicket = async (req: Request, res: Response, next: NextFunction) => {
  const { ticketId } = req.params
  const currentUser = res.locals.user
  try {
    if (mongoose.Types.ObjectId.isValid(ticketId)) {
      const ticket = await TicketModel.findOne({ _id: ticketId, created_by: currentUser._id }).populate('category')
      if (ticket) {
        res.status(200).json(ticket)
      } else {
        res.status(404).json('Ticket not found')
      }
    } else {
      res.status(404).json('Ticket not found')
    }
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
    const ticket = await TicketModel.findOneAndDelete({ _id: ticketId, created_by: currentUser._id })
    res.status(200).json({ msg: 'deleted' })
  } catch (err) {
    next(err)
  }
}
