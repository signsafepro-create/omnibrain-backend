import { Router, Request, Response } from "express";
import Stripe from "stripe";
import { db } from "../database";

const router = Router();
const stripeSecret = process.env.STRIPE_SECRET_KEY || "sk_test_mock_key";
const stripe = new Stripe(stripeSecret, { apiVersion: "2025-01-27.acacia" as any });

// Create Stripe Checkout Session or Payment Intent
router.post("/checkout", async (req: Request, res: Response) => {
  try {
    const { tier, email, successUrl, cancelUrl } = req.body;
    if (!tier || !email) {
      return res.status(400).json({ success: false, error: "Tier and email are required" });
    }

    const prices: Record<string, number> = {
      pro: 4900,
      premium: 19900,
      enterprise: 99900,
      institution: 499900
    };

    const amount = prices[tier.toLowerCase()] || 4900;

    if (process.env.STRIPE_SECRET_KEY) {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        customer_email: email,
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: { name: `LILJR Sovereign Stack - ${tier.toUpperCase()} Tier` },
              unit_amount: amount
            },
            quantity: 1
          }
        ],
        mode: "payment",
        success_url: successUrl || "https://x-sovereign.com/success",
        cancel_url: cancelUrl || "https://x-sovereign.com/cancel"
      });

      return res.json({ success: true, data: { checkoutUrl: session.url, sessionId: session.id } });
    } else {
      // Mock session for testing when API key is missing
      const mockSessionId = `cs_test_${Date.now()}`;
      return res.json({
        success: true,
        data: {
          checkoutUrl: `${successUrl || "https://x-sovereign.com/success"}?session_id=${mockSessionId}`,
          sessionId: mockSessionId,
          isMock: true
        }
      });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
