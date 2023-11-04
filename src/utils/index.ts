import { type Request } from 'express'

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
    if (properties) { errors[path] = properties.message }
  })
  return errors
}

interface paginatedQueryParams {
  page?: number
  limit?: number
}

interface paginatedResultsResponse {
  links: {
    prev: string
    next: string
  }
  meta: {
    totalItems: number
    totalPages: number
    page: number
  }
  skipOffSet: number
  limit: number
}

export const paginateResults = async (model: any, req: Request): Promise<paginatedResultsResponse> => {
  const { page = 1, limit = 10 }: paginatedQueryParams = req.query
  /*
    skipOffSet will determine where the paginated results should start.
    For example, if we have 30 items and I want to display the second page, and the limit per page is 10,
    the offset will be 10 (for the second page), as it should start showing from the 11th item.
  */
  const skipOffSet = page > 1 ? (page - 1) * limit : 0

  const totalItems = await model.countDocuments()
  const totalPages: number = Math.ceil(totalItems / limit)

  const prevPage = page > 1 ? page - 1 : null
  const nextPage = page < totalPages ? page + 1 : null

  const links = {
    prev: '',
    next: ''
  }

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
      page
    },
    skipOffSet,
    limit
  }
}
