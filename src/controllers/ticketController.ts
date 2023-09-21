import { type Request, type Response } from 'express'
import { TicketModel } from '../models/Ticket'
import { handleErrors } from '../helpers'


export const createTicket = async (req: Request, res: Response) => {
    const { title, category, status, priority } = req.body
    const currentUser = res.locals.user
    try {
        const ticket = await TicketModel.create({ title, category, status, priority, user_id: currentUser._id })
        res.status(201).json({ ticket })
    } catch(err) {
        res.status(400).json({errors: handleErrors(err)})
    }
}

// Needs to add pagination
export const listTickets = async (req: Request, res: Response) => {
    const currentUser = res.locals.user
    try {
        const tickets = await TicketModel.find({ user_id: currentUser._id })
        res.status(200).json(tickets)
    } catch (err) {
        res.status(400).json({errors: handleErrors(err)})
    }
}

export const getTicket = async (req: Request, res: Response) => {
    const { ticketId } = req.params
    const currentUser = res.locals.user
    try {
        const ticket = await TicketModel.findOne({ _id: ticketId, user_id: currentUser._id})
        res.status(200).json(ticket)
    } catch (err) {
        res.status(400).json({errors: handleErrors(err)})
    }
}

export const deleteTicket = async (req: Request, res: Response) => {
    const { ticketId } = req.params
    const currentUser = res.locals.user
    try {
        const ticket = await TicketModel.findOneAndDelete({ _id: ticketId, user_id: currentUser._id})
        res.status(200).json({msg: 'deleted'})
    } catch (err) {
        res.status(400).json({erroor: handleErrors(err)})
    }
}

