import AppError from "../utils/app_error";
export default (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: true });
    if (error) {
        return next(new AppError(error.details[0].message, 400));
    }
    next();
};
