import AppError from "../utils/app_error";
class ErrorHandler {
    async handleError(error) {
    }
    isTrustedError(error) {
        if (error instanceof AppError) {
            return error.isOperational;
        }
        return false;
    }
    static handleCastErrorDB(err) {
        const message = `Invalid ${err.path}: ${err.value}.`;
        return new AppError(message, 400);
    }
    static handleDuplicateFieldsDB(err) {
        const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
        console.log(value);
        const message = `Duplicate field value: ${value}. Please use another value!`;
        return new AppError(message, 400);
    }
    static handleValidationErrorDB(err) {
        const errors = Object.values(err.errors).map((el) => el.message);
        const message = `Invalid input data. ${errors.join(". ")}`;
        return new AppError(message, 400);
    }
    static sendErrorDev(err, req, res) {
        if (req.originalUrl.startsWith("/api")) {
            return res.status(err.statusCode).json({
                status: err.statusCode,
                error: err,
                message: err.message,
                stack: err.stack,
            });
        }
        console.error("ERROR ", err);
        return res.status(err.statusCode).render("error", {
            title: "Something went wrong!",
            msg: err.message,
        });
    }
    static handleJWTError() {
        return new AppError("Invalid token. Please log in again!", 401);
    }
    static handleJWTExpiredError() {
        return new AppError("Your token has expired! Please log in again.", 401);
    }
    static sendErrorProd(err, req, res) {
        if (req.originalUrl.startsWith("/api")) {
            if (err.isOperational) {
                return res.status(err.statusCode).json({
                    status: err.statusCode,
                    message: err.message,
                });
            }
            console.error("ERROR ", err);
            return res.status(500).json({
                status: "error",
                message: "Something went very wrong!",
            });
        }
        if (err.isOperational) {
            console.log(err);
            return res.status(err.statusCode).render("error", {
                title: "Something went wrong!",
                msg: err.message,
            });
        }
        console.error("ERROR 💥", err);
        return res.status(err.statusCode).render("error", {
            title: "Something went wrong!",
            msg: "Please try again later.",
        });
    }
}
export default (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    if (process.env.NODE_ENV === "development") {
        ErrorHandler.sendErrorDev(err, req, res);
        console.error(err);
    }
    else if (process.env.NODE_ENV === "production") {
        let error = { ...err };
        error.message = err.message;
        if (error.name === "CastError")
            error = ErrorHandler.handleCastErrorDB(error);
        if (error.code === 11000)
            error = ErrorHandler.handleDuplicateFieldsDB(error);
        if (error.name === "ValidationError")
            error = ErrorHandler.handleValidationErrorDB(error);
        if (error.name === "JsonWebTokenError")
            error = ErrorHandler.handleJWTError();
        if (error.name === "TokenExpiredError")
            error = ErrorHandler.handleJWTExpiredError();
        ErrorHandler.sendErrorProd(error, req, res);
    }
};
