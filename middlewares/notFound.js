export const notFoundError = (req, res, next) =>{
    const error = new Error(`this Route ${req.originalUrl} is not found`)
    error.statusCode = 404;
    next(error)
}