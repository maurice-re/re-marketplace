import type { Request, Response } from 'express';

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function handler(req: Request, res: Response) {
  const { cost, id } = req.body;
  let customerId = id;
  if(customerId == "") {
    const customer = await stripe.customers.create();
    customerId = customer.id
  }
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: cost * 100,
    automatic_payment_methods: {
      enabled: true,
    },
    currency: "usd",
    customer: customerId,
    setup_future_usage: "off_session",
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
    customerId: customerId
  });
};