export class ApiError extends Error {
    status: number
    constructor(status: number, message: string) {
        super(message)
        this.status = status
        this.name = "ApiError"
    }
}

export const badRequest =  (msg: string) => new ApiError(400, msg)
export const unauthorized = (msg: string) => new ApiError(401, msg)
export const notFound = (msg: string) => new ApiError(404, msg)
