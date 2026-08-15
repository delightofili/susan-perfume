import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { prisma } from "../config/db.js";
import { AuthRequest } from "../types/index.js";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    let user = await prisma.user.findUnique({ where: { email } });

    // Seed default admin if user table is empty or admin missing
    if (!user && email === "admin@susanperfume.com" && password === "admin123") {
      const passwordHash = await bcrypt.hash("admin123", 10);
      user = await prisma.user.create({
        data: {
          email: "admin@susanperfume.com",
          passwordHash,
          name: "Susan Admin",
          role: "ADMIN",
        },
      });
    }

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const secret = process.env.JWT_SECRET || "fallback_secret";
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      secret,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error("Login Error:", error);
    return res.status(500).json({ error: error.message || "Failed to log in" });
  }
};

export const me = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  return res.status(200).json({ user: req.user });
};
