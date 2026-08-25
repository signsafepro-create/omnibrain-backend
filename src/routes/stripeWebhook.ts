import { Request, Response } from "express";
import Stripe from "stripe";
import { db } from "../database";

const stripeSecret = process.env.STRIPE_SECRET_KEY || "sk_test_mock_key";
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || "";
const stripe = new Stripe(stripeSecret, { apiVersion: "2025-01-27.acacia" as any });

export async function handleStripeWebhook(req: Request, res: Response) {
  const sig = req.headers["stripe-signature"];
  let event: Stripe.Event;

  if (endpointSecret && sig) {
    try {
      const rawBody = (req as any).rawBody || JSON.stringify(req.body);
      event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
    } catch (err: any) {
      console.warn("[Webhook Error] Signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  } else {
    event = req.body;
  }

  console.log(`[Webhook Event Received] ${event.type}`);

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const email = session.customer_email || session.customer_details?.email;
        if (email) {
          db.updateUserTier(email, "pro");
          console.log(`[Webhook] User ${email} upgraded to Pro tier`);
        }
        break;
      }
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const email = invoice.customer_email;
        if (email) {
          db.updateUserTier(email, "pro");
          console.log(`[Webhook] Invoice paid for ${email}`);
        }
        break;
      }
      default:
        console.log(`[Webhook] Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (err: any) {
    console.error("[Webhook Processing Error]", err.message);
    res.status(500).json({ error: "Internal processing error" });
  }
}
