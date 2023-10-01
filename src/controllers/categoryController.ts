import express, { NextFunction, type Request, type Response } from 'express'
import { CategoryModel } from '../models/Category'
import mongoose from 'mongoose'



export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
    const { title } = req.body

    const currentUser = res.locals.user
    try {
        const category = await CategoryModel.create({ title, user_id: currentUser._id })
        res.status(201).json(category)
    } catch (err) {
        next(err)
    }

}

interface listCategoriesQueryParams {
    page?: number,
    limit?: number
}

export const listCategories = async (req: Request, res: Response, next: NextFunction) => {
    const { page = 1, limit = 10 }: listCategoriesQueryParams = req.query
    const skipOffset = page > 1 ? (page - 1) * limit : 0

    const totalCategories = await CategoryModel.countDocuments()

    const totalPages: any = Math.ceil(totalCategories / limit)
    const prevPage = page > 1 ? page - 1 : null;
    const nextPage = page < totalPages ? page + 1 : null;

    let links: any = {};

    const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`

    if (prevPage) {
        links.prev = `${fullUrl}/?page=${prevPage}&limit=${limit}`
    }
    if (nextPage) {
        links.next = `${fullUrl}/?page=${nextPage}&limit=${limit}`
    }

    try {
        const categories = await CategoryModel
            .find({})
            .skip(skipOffset)
            .limit(limit)
        const responseBody = {
            links,
            meta: {
                totalItems: totalCategories,
                totalPages,
                page,
            },
            data: categories
        }
        res.status(200).json(responseBody)
    } catch (err) {
        next(err)
    }
}

export const getCategory = async (req: Request, res: Response, next: NextFunction) => {
    const { id: paramId } = req.params
    try {
        if (mongoose.Types.ObjectId.isValid(paramId)) {
            const categoryId = new mongoose.Types.ObjectId(paramId)
            const category = await CategoryModel.findOne({ _id: categoryId })
            if (category) {
                res.status(200).json(category)
            } else {
                res.status(404).json('Category not found')
            }
        } else {
            throw Error('Category not found')
        }
    } catch (err) {
        next(err)
    }
}

export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
    const { title } = req.body
    const { id: paramId } = req.params

    try {
        if (mongoose.Types.ObjectId.isValid(paramId)) {

            const categoryId = new mongoose.Types.ObjectId(paramId)

            const categoryExists = await CategoryModel.findOne({ _id: categoryId })

            if (!categoryExists) {
                res.status(404).json('Category not found')
            }

            const newCategory = await CategoryModel.updateOne({ _id: categoryId }, { title })
            res.status(201).json(newCategory)
        } else {
            throw Error('Category not found')
        }
    } catch (err) {
        next(err)
    }
}

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {

    const { id: categoryId } = req.params

    try {

        const categoryExists = await CategoryModel.findOne({ _id: categoryId })

        if (!categoryExists) {
            res.status(404).json('Category not found')
        }

        const deleteStatus = await CategoryModel.deleteOne({ _id: categoryId })
        res.status(200).json(deleteStatus)
    } catch (err) {
        next(err)
    }

}