/**
 * Module for AppError Class Definition
 */
type HttpCode = number;


/**
 * AppError - class to customize UM errors
 * @param description {String} message of the error
 * @param statusCode {Number} status code of the error
 * @param isOperational {Boolean} is the error predictable or uncaught
 *
 * @returns {Object} {name, statusCode, isOperational}
 */
class AppError extends Error {
  	public readonly statusCode: HttpCode;
	public readonly isOperational: boolean;
	public readonly success: boolean = false;

  constructor(description: string, statusCode: HttpCode, isOperational: boolean = true) {
    super(description);
	Object.setPrototypeOf(this, new.target.prototype);

    this.statusCode = statusCode;
    this.isOperational = isOperational;
	this.success = false;

    Error.captureStackTrace(this);
  }
}

export default AppError;
