import { NextFunction, Response, Request, RequestHandler } from "express";

export default function (fn: any): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
}
