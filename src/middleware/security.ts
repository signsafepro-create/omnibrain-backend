import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { db } from "../database";

const JWT_SECRET = process.env.JWT_SECRET || "sovereign_secret_key_change_in_production";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    tier: string;
  };
}

export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, error: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded: any) => {
    if (err) {
      return res.status(403).json({ success: false, error: "Invalid or expired token" });
    }
    req.user = decoded;
    next();
  });
}

export function validateApiKey(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const apiKey = req.headers["x-api-key"] as string;
  if (!apiKey) {
    return res.status(401).json({ success: false, error: "API key required" });
  }

  const user = db.getUsers().find((u) => u.apiKey === apiKey);
  if (!user) {
    return res.status(403).json({ success: false, error: "Invalid API key" });
  }

  req.user = { id: user.id, email: user.email, tier: user.tier };
  next();
}

export function generateToken(payload: { id: string; email: string; tier: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}
