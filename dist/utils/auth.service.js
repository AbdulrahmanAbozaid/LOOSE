import AppError from "./app_error";
import { verifyToken, generateToken } from "./token.service.js";
import asyncHandler from "../middlewares/async_handler";
import { parseTime } from "./time_service.js";
import Client from "../model/user/model";
export const authorize = asyncHandler(async (req, res, next) => {
    const accessToken = req.headers["authorization"] &&
        req.headers["authorization"].replace("Bearer ", "");
    const refreshToken = req.headers["x-refresh-token"];
    let user;
    if (!accessToken && !refreshToken) {
        return next(new AppError("Access or Refresh token not found", 404));
    }
    const { error: accessError, data: accessData } = await verifyToken(accessToken);
    if (accessError?.name === "TokenExpiredError") {
        const { error: refreshError, data: refreshData } = await verifyToken(refreshToken);
        if (refreshError?.name === "TokenExpiredError") {
            return next(new AppError("please login again", 401));
        }
        if (refreshError) {
            return next(refreshError);
        }
        user = await Client.findById(refreshData?.id);
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
        const newAccessToken = await generateToken(userData, parseTime("1d", "s"));
        const newRefreshToken = await generateToken(userData, parseTime("10d", "s"));
        res.setHeader("x-access-token", newAccessToken);
        res.setHeader("x-refresh-token", newRefreshToken);
        req.user = userData;
        return next();
    }
    if (accessError) {
        return next(accessError);
    }
    user = await Client.findById(accessData.id);
    if (!user) {
        return next(new AppError("user-not-found", 404));
    }
    if (!user.active) {
        return next(new AppError("user-not-active", 401));
    }
    req.user = {
        id: user._id,
        email: user.email,
        role: user.role,
    };
    next();
});
export const restrictTo = (...roles) => async (req, res, next) => {
    roles = roles.map(role => role.toLowerCase());
    if (roles.includes(req?.user?.role.toLowerCase())) {
        return next();
    }
    next(new AppError(`You are not allowed to use${req.originalUrl}`, 403));
};
