import { LocationType, Role } from "@prisma/client";
import type { Request, Response } from "express";
import prisma from "../../../constants/prisma";
import { SampleTransactionOrders } from "../../../utils/sample/sampleUtils";

async function create(req: Request, res: Response) {
  const {
    transaction,
    form,
    customerId
    } : {
      transaction: SampleTransactionOrders,
      form: string[],
      customerId: string
    } = req.body;
  
  if (!transaction || !form) {
    res.status(400).send("Empty body");
  }

  const now = new Date();
  const shippingInfo = form.slice(4);

  const company = await prisma.company.create({
    data: {
      createdAt: now,
      name: form[3],
      customerId: customerId
    },
  });

  await prisma.user.create({
    data: {
      companyId: company.id,
      createdAt: now,
      email: form[2],
      firstName: form[0],
      lastName: form[1],
      role: Role.USER
    },
  });

  let formIndex = 0;
  const location = await prisma.location.create({
    data: {
      type: LocationType.SAMPLE,
      city: shippingInfo[4 + 7 * formIndex],
      country: shippingInfo[1 + 7 * formIndex],
      companyId: company.id,
      line1: shippingInfo[2 + 7 * formIndex],
      line2: shippingInfo[3 + 7 * formIndex],
      shippingName: shippingInfo[0 + 7 * formIndex],
      state: shippingInfo[6 + 7 * formIndex],
      zip: shippingInfo[5 + 7 * formIndex],
    },
  });

  await prisma.sampleTransaction.create({
    data: {
      quantity: transaction.quantity,
      amount: transaction.amount,
      locationId: location.id,
      companyId: company.id,
      skuIds: transaction.skuIds,
      createdAt: now,
    },
  });

  res.status(200).send('Success');
}

export default create;