import jwt from "jsonwebtoken";
import AppError from "./app_error";

export const generateToken = async (payload: object, duration: number) => {
  if (!payload) {
    throw new Error("Token is required");
  }
  const token = jwt.sign(payload, process.env.TOKEN_SECRET as string, {
    expiresIn:
      process.env.NODE_ENV == "production"
        ? process.env.TOKEN_EXPIRY || duration
        : process.env.TOKEN_DEV,
  });

  return token;
};

export const verifyToken = async (token: string) => {
  try {
    const data: any = jwt.verify(token, process.env.TOKEN_SECRET as jwt.Secret);
    return { data };
  } catch (error: any) {
    return { error: new AppError(error.message, 400) };
  }
};
