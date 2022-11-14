import type { Request, Response } from "express";
import type { Stripe } from "stripe";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const stripe: Stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function handler(req: Request, res: Response) {
  const { paymentIntentId } = req.body;
  try {
    await stripe.paymentIntents.cancel(paymentIntentId);
} catch (error) {
  res.status(500).send({message: (error as Error).message});
  return;
}
  res.status(200).send();
}
