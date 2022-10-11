import type { Request, Response } from "express";
import type { Stripe } from "stripe";

const stripe: Stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function handler(req: Request, res: Response) {
  const { paymentIntentId, paymentMethod } = req.body;
  console.log(`paymentId ${paymentIntentId}`);
  console.log(`paymentMethod ${paymentMethod}`);
  const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
    off_session: false,
    payment_method: paymentMethod,
    setup_future_usage: "off_session",
  });

  res.send({
    status: paymentIntent.status,
  });
}
