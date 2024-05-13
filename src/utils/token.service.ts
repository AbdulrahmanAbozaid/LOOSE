import jwt from "jsonwebtoken";
import AppError from "./app_error";

export const generateToken = async (payload: object, duration: number) => {
  const token = jwt.sign(payload, process.env.TOKEN_SECRET as string, {
    algorithm: "HS512",
    expiresIn: duration || 60 * 60,
  });

  return token;
};

export const verifyToken = async (token: string) => {
  try {
    const data: any = jwt.verify(token, process.env.TOKEN_SECRET as string, {
      algorithms: ["HS512"],
    });
    return { data };
  } catch (error: any) {
    return { error: new AppError(error.message, 400) };
  }
};
