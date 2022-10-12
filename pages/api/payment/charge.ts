import type { Request, Response } from "express";
import type { Stripe } from "stripe";

const stripe: Stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function handler(req: Request, res: Response) {
  const {customerId, paymentIntentId, paymentMethod, total } = req.body;
  try {

    const res = await stripe.paymentIntents.create({
      amount: parseInt((total * 100).toFixed(0)),
      currency: "usd",
      capture_method: "automatic",
      off_session: false,
      payment_method: paymentMethod,
      payment_method_types: ["us_bank_account"],
      customer: customerId,
      confirm: true,
    })

    await stripe.paymentIntents.cancel(paymentIntentId);
} catch (error) {
  res.status(500).send({message: (error as Error).message});
  return;
}
  res.status(200).send();;
}
