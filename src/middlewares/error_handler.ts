import { NextFunction, Response, Request } from "express";
import AppError from "../utils/app_error";

/**
 * Handles errors that occur in the application.
 *
 * This middleware function is responsible for handling errors that occur during the
 * execution of the application. It determines the appropriate error response based on
 * the environment (development or production) and the type of error that occurred.
 *
 * In the development environment, the function will return a detailed error response
 * with the error status, message, and stack trace. In the production environment, the
 * function will handle different types of errors, such as cast errors, duplicate field
 * errors, validation errors, and JWT errors, and return an appropriate error response.
 *
 * @param err - The error object that was encountered.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware function in the chain.
 */
class ErrorHandler {
  public async handleError(error: Error): Promise<void> {
    // log Error
    // Send Mail
    // save in ops queue if critical
    // determine if operational
  }

  /**
   * Checks if an error is an operational error that can be trusted.
   *
   * This function determines whether an error is an instance of the `AppError` class,
   * which indicates that it is an operational error that can be trusted and handled
   * appropriately.
   *
   * @param error - The error object to be checked.
   * @returns `true` if the error is an operational error, `false` otherwise.
   */
  public isTrustedError(error: Error) {
    if (error instanceof AppError) {
      return error.isOperational;
    }
    return false;
  }

  /**
   * Handles a cast error that occurred in the database.
   *
   * This function creates a new `AppError` instance with a message that describes the
   * invalid input data that caused the cast error.
   *
   * @param err - The error object that was encountered.
   * @returns A new `AppError` instance with the appropriate error message.
   */
  public static handleCastErrorDB(err: any) {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
  }

  /**
   * Handles a duplicate field error that occurred in the database.
   *
   * This function creates a new `AppError` instance with a message that describes the
   * duplicate field value that caused the error.
   *
   * @param err - The error object that was encountered.
   * @returns A new `AppError` instance with the appropriate error message.
   */
  public static handleDuplicateFieldsDB(err: any) {
    const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
    console.log(value);

    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new AppError(message, 400);
  }

  /**
   * Handles a validation error that occurred in the database.
   *
   * This function creates a new `AppError` instance with a message that describes the
   * invalid input data that caused the validation error.
   *
   * @param err - The error object that was encountered.
   * @returns A new `AppError` instance with the appropriate error message.
   */
  public static handleValidationErrorDB(err: any) {
    const errors = Object.values(err.errors).map((el: any) => el.message);

    const message = `Invalid input data. ${errors.join(". ")}`;
    return new AppError(message, 400);
  }

  /**
   * Sends an error response in the development environment.
   *
   * This function is responsible for sending the appropriate error response to the client
   * based on the environment and the type of error that occurred. If the request is for
   * the API, it will return a JSON response with the error status, message, and stack
   * trace. If the request is for the web application, it will render an error page with
   * the appropriate error message.
   *
   * @param err - The error object that was encountered.
   * @param req - The Express request object.
   * @param res - The Express response object.
   */
  public static sendErrorDev(err: AppError, req: Request, res: Response) {
    // A) API
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

  /**
   * Handles a JWT error.
   *
   * This function creates a new `AppError` instance with a message that describes the
   * invalid JWT token that caused the error.
   *
   * @returns A new `AppError` instance with the appropriate error message.
   */
  public static handleJWTError() {
    return new AppError("Invalid token. Please log in again!", 401);
  }

  /**
   * Handles a JWT expired error.
   *
   * This function creates a new `AppError` instance with a message that describes the
   * expired JWT token that caused the error.
   *
   * @returns A new `AppError` instance with the appropriate error message.
   */
  public static handleJWTExpiredError() {
    return new AppError("Your token has expired! Please log in again.", 401);
  }

  /**
   * Handles the production environment error response for the application.
   *
   * This function is responsible for sending the appropriate error response to the client
   * based on the environment and the type of error that occurred. If the request is for
   * the API, it will return a JSON response with the error status and message. If the
   * request is for the web application, it will render an error page with the appropriate
   * error message.
   *
   * @param {any} err - The error object that was encountered.
   * @param {Request} req - The Express request object.
   * @param {Response} res - The Express response object.
   */
  public static sendErrorProd(err: any, req: Request, res: Response) {
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
export default (err: any, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === "development") {
    ErrorHandler.sendErrorDev(err, req, res);
	console.error(err);
  } else if (process.env.NODE_ENV === "production") {
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
