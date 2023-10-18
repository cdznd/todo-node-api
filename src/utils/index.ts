import { Request } from "express"

interface Errors {
  errors: {
    name: Error
    email: Error
    password: Error
  }
  message: string
  code?: string
}

interface Error {
  properties: any
  kind: string
  path: string
  value?: string
  reason?: string
}

type ValidationError = Record<string, string>

export const handleValidationErrors = (err: Errors): ValidationError => {
  const errors: any = {}
  Object.values(err.errors).forEach(({ path, properties }) => {
    if(properties)
      errors[path] = properties.message
  })
  return errors
}

interface paginatedQueryParams {
  page?: number,
  limit?: number
}

export const paginateResults = async (model: any, req: Request) => {
  
  const { page = 1, limit = 10 }: paginatedQueryParams = req.query
  const skipOffset = page > 1 ? (page - 1) * limit : 0

  const totalItems = await model.countDocuments()
  const totalPages: any = Math.ceil(totalItems / limit)

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

  return {
    links,
    meta: {
      totalItems,
      totalPages,
      page,
    },
    skipOffset,
    limit,
  };

}