import { type NextFunction, type Request, type Response } from 'express'
import { TicketModel } from '../models/Ticket'
import { paginateResults } from '../utils'
import mongoose from 'mongoose'
import { CategoryModel } from '../models/Category'

export const createTicket = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { title, category, description, status, priority } = req.body
  const currentUser = res.locals.user
  try {
    const ticket = await TicketModel.create({ title, category, description, status, priority, created_by: currentUser._id })
    res.status(201).json(ticket)
  } catch (err) {
    console.error(err)
    next(err)
  }
}

export const listTickets = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const currentUser = res.locals.user
  try {
    const tickets = await TicketModel.aggregate([
      {
        $match: { created_by: currentUser._id } // Filter by user
      },
      {
        $group: {
          _id: "$status", // Group by status
          count: { $sum: 1 }, // Count tickets per status
          tickets: { $push: "$$ROOT" } // Push full ticket data
        }
      },
      { $sort: { _id: 1 } } // Optional: Sort by status
    ]);
    res.status(200).json({ data: tickets });
  } catch (err) {
    next(err)
  }
}

export const getTicket = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
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

export const updateTicket = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const currentUser = res.locals.user
  const { ticketId } = req.params
  const categoryId = new mongoose.Types.ObjectId(req.body.category)
  const category = await CategoryModel.findOne({ _id: categoryId })
  if (category) {
    const newTicket = { ...req.body, category: category._id }
    try {
      if (mongoose.Types.ObjectId.isValid(ticketId)) {
        const ticket = await TicketModel.findOneAndUpdate({ _id: ticketId, created_by: currentUser._id }, newTicket, { new: true })
        if (ticket) {
          res.status(200).json(ticket)
        } else {
          res.status(404).json('Error during update')
        }
      } else {
        res.status(404).json('Ticket not found')
      }
    } catch (err) {
      next(err)
    }
  } else {
    res.status(404).json('Error Category not found')
  }
}

export const deleteTicket = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { ticketId } = req.params
  const currentUser = res.locals.user
  try {
    if (mongoose.Types.ObjectId.isValid(ticketId)) {
      const ticketExists = await TicketModel.find({ _id: ticketId, created_by: currentUser._id })
      if (ticketExists) {
        const deleteStatus = await TicketModel.deleteOne({ _id: ticketId })
        res.status(200).json(deleteStatus)
      } else {
        res.status(404).json('Error Ticket not found')
      }
    } else {
      res.status(404).json('Ticket not found')
    }
  } catch (err) {
    next(err)
  }
}
