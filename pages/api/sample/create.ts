import { LocationType } from "@prisma/client";
import type { Request, Response } from "express";
import prisma from "../../../constants/prisma";
import { SampleOrderWithSkuID } from "../../../utils/sample/sampleUtils";

async function create(req: Request, res: Response) {
  const {
    transaction,
    form,
    customerId
  }: {
    transaction: SampleOrderWithSkuID,
    form: string[],
    customerId: string;
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
    },
  });
  const location = await prisma.location.create({
    data: {
      type: LocationType.SAMPLE,
      city: shippingInfo[11],
      country: shippingInfo[8],
      line1: shippingInfo[9],
      line2: shippingInfo[10],
      shippingName: shippingInfo[7],
      state: shippingInfo[13],
      zip: shippingInfo[12],
    },
  });

  await prisma.sampleOrder.create({
    data: {
      quantity: transaction.quantity,
      amount: transaction.amount,
      locationId: location.id,
      skuIds: transaction.skuIds,
      createdAt: now,
    },
  });

  res.status(200).send('Success');
}

export default create;