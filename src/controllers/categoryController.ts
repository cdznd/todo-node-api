import express, { NextFunction, type Request, type Response } from 'express'

import { CategoryModel } from '../models/Category'

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
    const { title } = req.body
    const currentUser = res.locals.user
    try {
        const category = await CategoryModel.create({ title, user_id: currentUser._id })
        res.status(201).json(category)
    } catch(err) {
        next(err)
    }

}

export const listCategories = async (req: Request, res: Response, next: NextFunction) => {
    const cateogories = await CategoryModel.find({})
    res.status(200).json(cateogories)
}

export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {

}

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {

}