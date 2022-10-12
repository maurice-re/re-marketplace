import type { Request, Response } from "express";
import type { Stripe } from "stripe";

const stripe: Stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function handler(req: Request, res: Response) {
  const { paymentIntentId, paymentMethod } = req.body;
  console.log(`paymentId ${paymentIntentId}`);
  console.log(`paymentMethod ${paymentMethod}`);
  try {

    await stripe.paymentIntents.confirm(paymentIntentId, {
      capture_method: "automatic",
    off_session: false,
    payment_method: paymentMethod,
  })
} catch (error) {
  res.status(500).send({message: (error as Error).message});
  return;
}
  console.log("success");
  res.status(200).json({ statusCode: 200, message: "success" }).send();;
}
