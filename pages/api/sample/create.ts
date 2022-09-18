import type { Request, Response } from "express";
import prisma from "../../../constants/prisma";
import { allLocations, calculateAmount } from "../../../utils/prisma/sample";
import { SampleTransactionOrders } from "../../../utils/sample/sampleUtils";

async function create(req: Request, res: Response) {
  const {
    transaction,
    form
    } : {
      transaction: SampleTransactionOrders,
      form: string[]
    } = req.body;
  
  if (!transaction || !form) {
    res.status(400).send("Empty body");
  }

  const now = new Date();
  const tax = 1.07
  const shippingInfo = form.slice(4);

  const company = await prisma.company.create({
    data: {
      createdAt: now,
      name: form[3],
      customerId: transaction.orders[0].company.customerId
    },
  });

  const newTransaction = await prisma.sampleTransaction.create({
    data: {
      amount: calculateAmount(transaction.amount, tax), // transaction JSON amount excludes tax
      createdAt: now,
    },
  });

  let formIndex = 0;
  allLocations(transaction.orders).forEach(async (city) => {
    const location = await prisma.location.create({
      data: {
        city: shippingInfo[4 + 7 * formIndex],
        country: shippingInfo[1 + 7 * formIndex],
        companyId: company.id,
        lastOrderDate: now,
        line1: shippingInfo[2 + 7 * formIndex],
        line2: shippingInfo[3 + 7 * formIndex],
        shippingName: shippingInfo[0 + 7 * formIndex],
        state: shippingInfo[6 + 7 * formIndex],
        userId: transaction.orders[0].company.customerId,
        zip: shippingInfo[5 + 7 * formIndex],
      },
    });
    transaction.orders.forEach( async (order) => {
      if(order.location == city) {
        await prisma.order.create({
            data: {
                amount: order.amount,
                companyId: company.id,
                createdAt: now,
                locationId: location.id,
                quantity: order.quantity, // default 1
                skuId: order.sku.id,
                sampleTransactionId: newTransaction.id,
                userId: order.userId,
                sample: order.sample
            }
        })
      }
    })
    formIndex += 1
  })

  res.status(200).send('Success');
}

export default create;
