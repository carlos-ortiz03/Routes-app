import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import { errorHandler } from "./error";

// Extend the Request interface to include the user property
export interface CustomRequest extends Request {
  user?: {
    id: string;
    email: string;
    username: string;
  };
}

export const verifyUser = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.access_token;

  if (!token) {
    console.log("No token found in cookies");
    return next(errorHandler(401, "Unauthorized"));
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET as string,
    ((err: VerifyErrors | null, decoded: JwtPayload | undefined) => {
      if (err) {
        console.log("Error verifying token:", err);
        return next(errorHandler(401, "Unauthorized"));
      } else {
        if (
          decoded &&
          typeof decoded === "object" &&
          "id" in decoded &&
          "email" in decoded &&
          "username" in decoded
        ) {
          req.user = {
            id: decoded.id as string,
            email: decoded.email as string,
            username: decoded.username as string,
          };
          console.log("User authenticated:", req.user);
          next();
        } else {
          return next(errorHandler(401, "Unauthorized"));
        }
      }
    }) as jwt.VerifyCallback
  );
};
