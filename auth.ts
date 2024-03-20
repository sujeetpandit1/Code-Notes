import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Define a custom type for the user data
interface UserData {
  userID: string;
  phone: string;
  uid: string;
}

// Extend the Request type to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: UserData;
    }
  }
}

export const auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({ status: "failed", message: "Authentication token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as UserData;

    if (!decoded) {
      return res
        .status(400)
        .json({ status: "failed", message: "Invalid Token" });
    }

    req.user = decoded;

    next();
  } catch (error) {
    // console.error(error);
    return res
      .status(401)
      .json({ status: "failed", message: "Authentication failed" });
  }
};
