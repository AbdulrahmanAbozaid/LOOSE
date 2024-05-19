class AppError extends Error {
    statusCode;
    isOperational;
    success = false;
    constructor(description, statusCode, isOperational = true) {
        super(description);
        Object.setPrototypeOf(this, new.target.prototype);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.success = false;
        Error.captureStackTrace(this);
    }
}
export default AppError;
