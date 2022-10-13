import { Role } from "@prisma/client";
import { Request, Response } from "express";
import Stripe from "stripe";
import prisma from "../../constants/prisma";

const stripe: Stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

async function user(req: Request, res: Response) {
  if (req.method != "POST") {
    res.status(400).send();
    return;
  }

  const {
    company,
    email,
    firstName,
    hasCompany,
    lastName,
  }: {
    company: string;
    email: string;
    firstName: string;
    hasCompany: boolean;
    lastName: string;
  } = req.body;

  const doesUserExist = await prisma.user.findFirst({
    where: {
      email: email
    }
  })
  if(doesUserExist != undefined) {
    res.status(409).send();
    return;
  }

  if (hasCompany) {
    const _company = await prisma.company.findFirst({
      where: {
        id: company,
      },
    });

    if (_company == undefined) {
      res.status(400).send("Invalid Company Id");
    } else {
      await prisma.user.create({
        data: {
          companyId: _company.id,
          createdAt: new Date(),
          email: email,
          firstName: firstName,
          lastName: lastName,
          role: Role.USER,
        },
      })
    }
  } else {
  const now = new Date();
  const customer = await stripe.customers.create();

  const _company = await prisma.company.create({
    data: {
        createdAt: now,
        customerId: customer.id,
        name: company,
    }
  })

  await prisma.user.create({
    data: {
        companyId: _company.id,
        createdAt: now,
        email: email,
        firstName: firstName,
        lastName: lastName,
        role: Role.ADMIN
    }
  })
}
  res.status(200).send("Check your email to login");
}
export default user;
