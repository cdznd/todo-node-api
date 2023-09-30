import express, { NextFunction, type Request, type Response } from 'express'

import { CategoryModel } from '../models/Category'

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {

    const { title } = req.body
    
    try {
        const category = await CategoryModel.create({title})
        res.status(201).json(category)
    } catch(err) {
        next(err)
    }

}

export const listCategories = async (req: Request, res: Response, next: NextFunction) => {
    const cateogories = await CategoryModel.find({})
    res.status(200).json(cateogories)
}