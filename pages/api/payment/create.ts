import type { Request, Response } from "express";
import type { Stripe } from "stripe";

const stripe: Stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function handler(req: Request, res: Response) {
  const { cost, id } : {cost: number, id: string} = req.body;
  let customerId = id;
  if (customerId == "") {
    const customer = await stripe.customers.create();
    customerId = customer.id;
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: parseInt((cost * 100).toFixed(0)),
      currency: "usd",
      customer: customerId,
      setup_future_usage: "off_session",
      payment_method_types: ["card", "us_bank_account"],
      // payment_method_options: {
      //   us_bank_account: {
      //     financial_connections: {permissions: ['payment_method', 'balances']},
      //   },
      // },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
      customerId: customerId,
    });
  } else {
    const paymentMethods = await stripe.customers.listPaymentMethods(
      id,
      {type: "card"}
    )
    console.log(parseInt((cost * 100).toFixed(0)))
    const paymentIntent = await stripe.paymentIntents.create({
      amount: parseInt((cost * 100).toFixed(0)),
      currency: "usd",
      customer: customerId,
      setup_future_usage: "off_session",
      payment_method_types: ["card", "us_bank_account"],
      // payment_method_options: {
      //   us_bank_account: {
      //     financial_connections: {permissions: ['payment_method', 'balances']},
      //   },
      // },
    });
    res.send({
      clientSecret: paymentIntent.client_secret,
      paymentId: paymentIntent.id,
      paymentMethods: paymentMethods.data
    })
  }
}
