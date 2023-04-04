import { LocationType } from "@prisma/client";
import type { Request, Response } from "express";
import Stripe from "stripe";
import { prisma } from "../../constants/prisma";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const stripe: Stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);


async function create(req: Request, res: Response) {
  const {
    info,
    quantity,
    skuIds,
  }: {
    info: Record<string, string>
    quantity: number;
    skuIds: string;
  } = req.body;

  if (!skuIds || !info) {
    res.status(400).send("Empty body");
  }
  const now = new Date();

  const customer = await stripe.customers.create({
    description: 'Sample Order by ' + info["firstName"] + ' ' + info["lastName"],
    name: info["company"],
  });


  const company = await prisma.company.create({
    data: {
      createdAt: now,
      name: info["company"],
      customerId: customer.id
    },
  });

  const location = await prisma.location.create({
    data: {
      type: LocationType.SAMPLE,
      city: info["city"],
      country: info["country"],
      line1: info["line1"],
      line2: info["line2"],
      shippingName: info["firstName"] + ' ' + info["lastName"],
      state: info["state"],
      zip: info["zip"],
    },
  });
  
  await prisma.user.create({
    data: {
      companyId: company.id,
      createdAt: now,
      email: info["email"],
      firstName: info["firstName"],
      lastName: info["lastName"],
      ownedLocations: {connect: {id: location.id}}
    },
  });

  await prisma.sampleOrder.create({
    data: {
      quantity: quantity,
      amount: 0,
      locationId: location.id,
      skuIds: skuIds,
      createdAt: now,
    },
  });

  res.status(200).send('Success');
}

export default create;