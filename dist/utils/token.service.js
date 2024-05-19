import jwt from "jsonwebtoken";
import AppError from "./app_error";
export const generateToken = async (payload, duration) => {
    if (!payload) {
        throw new Error("Token is required");
    }
    const token = jwt.sign(payload, process.env.TOKEN_SECRET, {
        expiresIn: process.env.NODE_ENV == "production"
            ? process.env.TOKEN_EXPIRY || duration
            : process.env.TOKEN_DEV,
    });
    return token;
};
export const verifyToken = async (token) => {
    try {
        const data = jwt.verify(token, process.env.TOKEN_SECRET);
        return { data };
    }
    catch (error) {
        return { error: new AppError(error.message, 400) };
    }
};
