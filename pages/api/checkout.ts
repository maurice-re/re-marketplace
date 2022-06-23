import type { Request, Response } from 'express';
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const titleToPriceId: { [key: string]: string } = {
  '1.5 L Recycled Polypropylene' : "price_1LDbaLIvFN7nmmk5FI39l76U",
  '1 L Recycled Polypropylene' : "price_1LDbbPIvFN7nmmk5Gp0RF9ek",
  "8 oz Recycled Polypropylene": "price_1LDtvAIvFN7nmmk5OHlhpy2R",
  "16 oz Recycled Polypropylene" : "price_1LDtvjIvFN7nmmk5EhxbhjA2",
  '1.5 L Polypropylene' : "price_1LDbaLIvFN7nmmk5FI39l76U",
  '1 L Polypropylene' : "price_1LDbbPIvFN7nmmk5Gp0RF9ek",
  "8 oz Polypropylene": "price_1LDtvAIvFN7nmmk5OHlhpy2R",
  "16 oz Polypropylene" : "price_1LDtvjIvFN7nmmk5EhxbhjA2"
}

export default async function handler(req : Request, res : Response) {
  const { cartString } : {cartString: string} = req.body;
  console.log("body")
  const cart = cartString.split(',');
  console.log(cart)

  const items = cart.map(i => {
    const [title, quantity] = i.split('^');
    return {
      price: titleToPriceId[title],
      quantity: quantity
    }
  })

  console.log(items)

  if (req.method === 'POST') {
    try {
      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create({
        billing_address_collection: 'auto',
        shipping_address_collection: {
          allowed_countries: ['US', 'CA', 'TW'],
        },
        shipping_options: [
          {
            shipping_rate_data: {
              type: 'fixed_amount',
              fixed_amount: {
                amount: 10000,
                currency: 'usd',
              },
              display_name: 'Air to Singapore',
              // Delivers between 5-7 business days
              delivery_estimate: {
                minimum: {
                  unit: 'business_day',
                  value: 5,
                },
                maximum: {
                  unit: 'business_day',
                  value: 7,
                },
              }
            }
          },
        ],
        line_items: items,
        mode: 'payment',
        payment_method_types: ["card", "us_bank_account"],
        success_url: `${req.headers.origin}/form/success?cart=${cartString}`,
        cancel_url: `${req.headers.origin}/form/summary?canceled=true&cart=${cartString}`,
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