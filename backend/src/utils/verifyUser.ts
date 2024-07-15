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
    console.error("No token found in cookies");
    return next(errorHandler(401, "Unauthorized"));
  }

  console.log("Verifying token:", token);

  jwt.verify(
    token,
    process.env.JWT_SECRET as string,
    ((err: VerifyErrors | null, decoded: JwtPayload | undefined) => {
      if (err) {
        console.error("Token verification error:", err);
        return next(errorHandler(401, "Unauthorized"));
      } else {
        console.log("Token decoded:", decoded);
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
          next();
        } else {
          console.error("Decoded token does not contain required fields");
          return next(errorHandler(401, "Unauthorized"));
        }
      }
    }) as jwt.VerifyCallback
  );
};
