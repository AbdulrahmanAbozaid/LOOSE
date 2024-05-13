import jwt from "jsonwebtoken";
import AppError from "./app_error";

export const generateToken = async (payload: object, duration: number =60 * 60) => {
	if (!payload) {
		throw new Error("Token is required")
	}
  const token = jwt.sign(payload, process.env.TOKEN_SECRET as string, {
    expiresIn: duration,
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
