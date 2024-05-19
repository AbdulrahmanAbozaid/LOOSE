import AppError from "../utils/app_error.js";
export default (function (schema) {
  return function (req, res, next) {
    var _schema$validate = schema.validate(req.body, {
        abortEarly: true
      }),
      error = _schema$validate.error; // validate all fields

    if (error) {
      //   const errorDetails = error.details.map((detail: any) => ({
      //     field: detail.path[0],
      //     message: detail.message,
      //   }));

      return next(new AppError(error.details[0].message, 400));
    }
    next();
  };
});