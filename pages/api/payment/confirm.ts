import type { Request, Response } from "express";
import type { Stripe } from "stripe";

const stripe: Stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function handler(req: Request, res: Response) {
  const { paymentId, paymentMethod } = req.body;
  console.log(`paymentId ${paymentId}`);
  console.log(`paymentMethod ${paymentMethod}`);
  const paymentIntent = await stripe.paymentIntents.confirm(paymentId, {
    off_session: false,
    payment_method: paymentMethod,
  });

  res.send({
    status: paymentIntent.status,
  });
}
