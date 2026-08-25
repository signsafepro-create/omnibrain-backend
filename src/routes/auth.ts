import { Router, Request, Response } from "express";
import { db } from "../database";
import { generateToken, authenticateToken, AuthenticatedRequest } from "../middleware/security";

const router = Router();

// Register new user
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: "Email and password are required" });
    }

    const user = await db.createUser(email, password);
    const token = generateToken({ id: user.id, email: user.email, tier: user.tier });

    res.json({
      success: true,
      data: {
        token,
        user: { id: user.id, email: user.email, tier: user.tier, apiKey: user.apiKey }
      }
    });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Login existing user
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: "Email and password are required" });
    }

    const user = await db.verifyUser(email, password);
    if (!user) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }

    const token = generateToken({ id: user.id, email: user.email, tier: user.tier });

    res.json({
      success: true,
      data: {
        token,
        user: { id: user.id, email: user.email, tier: user.tier, apiKey: user.apiKey }
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get current authenticated user profile
router.get("/me", authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ success: false, error: "Not authenticated" });
  }
  const user = db.getUsers().find((u) => u.id === req.user?.id);
  res.json({
    success: true,
    data: user ? { id: user.id, email: user.email, tier: user.tier, apiKey: user.apiKey, balance: user.balance } : req.user
  });
});

export default router;
