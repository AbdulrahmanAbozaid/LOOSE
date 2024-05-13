import { NextFunction } from "express";
import AppError from "../utils/app_error";

export default (schema: any) => (req: Request, res: Response, next: NextFunction) => {
  const { error } = schema.validate(req.body, { abortEarly: true }); // validate all fields

  if (error) {
    //   const errorDetails = error.details.map((detail: any) => ({
    //     field: detail.path[0],
    //     message: detail.message,
    //   }));

    return next(
      new AppError(
        error.details[0].message,
        400
      )
    );
  }

  next();
};
