import { Request, Response } from "express";
import { JWT_SECRET } from "./config";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: { id: string; email: string }; // Extend Request to include user data
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: () => void
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1]; // Bearer <token>

  if (token == null) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      console.error("JWT Verification Error:", err);
      res.status(403).json({ error: "Invalid token" });
      return;
    }
    req.user = user; // Attach user data to the request
    next();
  });
};
