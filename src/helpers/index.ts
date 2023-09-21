
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

export const handleErrors = (err: Errors) => {
    const errors: any = {}
    Object.values(err.errors).forEach(({ path, properties }) => {
        errors[path] = properties.message
    })
    // if (err.message.includes('User validation failed')) {
    //     // msut fix typescript, destructuring
    //     Object.values(err.errors).forEach(({ path, properties }) => {
    //         errors[path] = properties.message
    //     })
    // }

    // if (err.message === 'Email not registered') {
    //     errors.email = 'Email not registered'
    // }

    // if (err.message === 'Incorrect Password') {
    //     errors.password = 'Incorrect Password'
    // }

    return errors
}