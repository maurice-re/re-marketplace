import type { Request, Response } from 'express';
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req : Request, res : Response) {
  if (req.method === 'POST') {
    try {
      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
            price: 'price_1LCWTAIvFN7nmmk5ocHSZbDu',
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${req.headers.origin}/form/success`,
        cancel_url: `${req.headers.origin}/form/summary?canceled=true`,
      });
      res.redirect(303, session.url);
    } catch (err) {
        if (err instanceof Error){
            res.status(500).json(err.message);
        }
        res.status(500).json('Unknown error')
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}