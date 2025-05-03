import { Request, Response } from "express";
import { JWT_SECRET } from "./config";
import jwt from "jsonwebtoken";
import prisma from "./prismaClient";

interface AuthRequest extends Request {
  user?: { id: string; email: string }; // Extend Request to include user data
}

export const authMiddleware = async(
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

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new Error("auth header not found");
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      throw new Error("token not found");
    }
    const decode = jwt.verify(token!, JWT_SECRET);
    const userId = decode as string;
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    req.userId = userId;
    next();
  } catch (e) {
    res.status(403).json({
      message: "Unauthorized",
    });
    return;
  }
};
