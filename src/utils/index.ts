
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

export const handleValidationErrors = (err: Errors) => {
    const errors: any = {}
    Object.values(err.errors).forEach(({ path, properties }) => {
        errors[path] = properties.message
    })
    return errors
}