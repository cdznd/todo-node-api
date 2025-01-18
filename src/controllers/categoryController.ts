import { type NextFunction, type Request, type Response } from 'express'
import { CategoryModel } from '../models/Category'
import mongoose from 'mongoose'
import { paginateResults } from '../utils'

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  const { title } = req.body
  const currentUser = res.locals.user
  try {
    const category = await CategoryModel.create({ title, created_by: currentUser._id })
    res.status(201).json(category)
  } catch (err) {
    next(err)
  }
}

export const listCategories = async (req: Request, res: Response, next: NextFunction) => {
  const { meta, links, limit, skipOffSet } = await paginateResults(CategoryModel, req)
  const currentUser = res.locals.user
  try {
    const categories = await CategoryModel
      .find({ created_by: currentUser._id })
      .skip(skipOffSet)
      .limit(limit)
    const responseBody = {
      links,
      meta: {
        totalItems: meta.totalItems,
        totalPages: meta.totalPages,
        page: meta.page
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
  const currentUser = res.locals.user
  try {
    if (mongoose.Types.ObjectId.isValid(paramId)) {
      const categoryId = new mongoose.Types.ObjectId(paramId)
      const category = await CategoryModel.findOne({ _id: categoryId, created_by: currentUser._id })
      if (category) {
        res.status(200).json(category)
      } else {
        res.status(404).json('Category not found')
      }
    } else {
      res.status(404).json('Category not found')
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
