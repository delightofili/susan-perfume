import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest, AuthenticatedUser } from "../types/index.js";

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized - missing or invalid token format" });
  }

  const token = authHeader.split(" ")[1];
  const secret = process.env.JWT_SECRET || "fallback_secret";

  try {
    const decoded = jwt.verify(token, secret) as AuthenticatedUser;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized - invalid or expired token" });
  }
};
