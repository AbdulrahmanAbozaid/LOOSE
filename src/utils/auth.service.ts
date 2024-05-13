// for handling tokens and authorization issues.
import AppError from "./app_error";
import { verifyToken, generateToken } from "./token.service.js";
import asyncHandler from "../middlewares/async_handler";
import { parseTime } from "./time_service.js";
import { NextFunction, Request, Response } from "express";
import Client from "../model/user/model";

// TODO:refactor

// authenticate Clients
export const authenticate = asyncHandler(
  async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
    const accessToken: string | undefined =
      req.headers["authorization"] &&
      req.headers["authorization"].replace("Bearer ", "");
    const refreshToken: string | undefined = req.headers[
      "x-refresh-token"
    ] as string;
    let user;

    if (!accessToken || !refreshToken) {
      return next(new AppError("Access or Refresh token not found", 404));
    }

    const { error: accessError, data: accessData } = await verifyToken(
      accessToken
    );

    if (accessError?.name === "TokenExpiredError") {
      const { error: refreshError, data: refreshData } = await verifyToken(
        refreshToken
      );

      if (refreshError?.name === "TokenExpiredError") {
        return next(new AppError("please login again", 401));
      }

      // another error thatn expiry
      if (refreshError) {
        return next(refreshError);
      }

      // refresh token is valid
      user = await Client.findById(refreshData?.id);

	  // check existency of the user
      if (!user) {
        return next(new AppError("user-not-found", 404));
      }

	  if (!user.active) {
		return next(new AppError("user-not-active", 401));
	  }

      const userData = {
        id: user.id,
        email: user.email,
        role: user.role,
      };

	  // create tokens
      const newAccessToken = await generateToken(
        userData,
        parseTime("1d", "s")
      );
      const newRefreshToken = await generateToken(
        userData,
        parseTime("10d", "s")
      );

	  // send tokens back
      res.setHeader("x-access-token", newAccessToken);
      res.setHeader("x-refresh-token", newRefreshToken);
	  req.user = userData;
	  return next();
    }

    // access token not valid
    if (accessError) {
      return next(accessError);
    }

	// ensure user exists
    user = await Client.findById(accessData.id);

    if (!user) {
      return next(new AppError("user-not-found", 404));
    }

	if (!user.active) {
		return next(new AppError("user-not-active", 401));
	}

	// pass user data to use in other middlewares
    req.user = {
      id: user._id,
      email: user.email,
      role: user.role,
    };
    // res.locals.user = user;
    next();
  }
);

// for role based access control
export const restrictTo =
  (...roles: string[]) =>
  async (req: Request & { user: any }, res: Response, next: NextFunction) => {
    if (roles.includes(req?.user?.role)) {
      return next();
    }

    next(new AppError(`You are not allowed to use${req.originalUrl}`, 403));
  };
