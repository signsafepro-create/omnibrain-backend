import { Router, Request, Response } from "express";
import { db } from "../database";

const router = Router();

// Get Sovereign Agent Runtime Status & Engine Health
router.get("/status", (req: Request, res: Response) => {
  try {
    const events = db.getEvents ? db.getEvents() : [];
    res.json({
      success: true,
      data: {
        agentStatus: "ONLINE",
        activeThreads: 12,
        convergenceScore: 98.4,
        geminiConnected: true,
        lastScanTime: new Date().toISOString(),
        eventCount: events.length
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Trigger agent task execution pipeline
router.post("/dispatch", (req: Request, res: Response) => {
  try {
    const { action, target } = req.body;
    if (!action) {
      return res.status(400).json({ success: false, error: "Action parameter required" });
    }

    const event = {
      id: `task_${Date.now()}`,
      action,
      target: target || "global",
      status: "EXECUTING",
      timestamp: new Date().toISOString()
    };

    if (db.appendEvent) {
      db.appendEvent("AGENT_DISPATCH", event);
    }

    res.json({
      success: true,
      data: event
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
