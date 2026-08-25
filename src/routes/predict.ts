import { Router, Request, Response } from "express";
import { db } from "../database";

const router = Router();

// Get list of all predicted IPO candidates and scores
router.get("/candidates", (req: Request, res: Response) => {
  try {
    const candidates = db.getCandidates();
    res.json({
      success: true,
      data: candidates
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Run prediction valuation model for a specific candidate
router.post("/evaluate", (req: Request, res: Response) => {
  try {
    const { candidateId, revenueRunRate, growthRate } = req.body;
    const candidates = db.getCandidates();
    const candidate = candidates.find((c) => c.id === candidateId);

    if (!candidate) {
      return res.status(404).json({ success: false, error: "Candidate not found" });
    }

    const calculatedValuationHigh = Math.round((revenueRunRate || candidate.revenue) * (growthRate || 1.5) * 12);
    const calculatedValuationLow = Math.round(calculatedValuationHigh * 0.7);
    const adjustedProbability = Math.min(0.99, Math.max(0.1, candidate.ipoProbability + (growthRate ? (growthRate - 1) * 0.1 : 0)));

    res.json({
      success: true,
      data: {
        candidateId: candidate.id,
        name: candidate.name,
        valuationLow: calculatedValuationLow,
        valuationHigh: calculatedValuationHigh,
        adjustedProbability,
        confidence: candidate.confidence,
        timestamp: new Date().toISOString()
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
