import type { Request, Response } from "express";
import prisma from "../../../constants/prisma";
import { OrderCustomerLocation } from "../../../utils/dashboard/dashboardUtils";


async function repeat(req: Request, res: Response) {
  const {
    order
  } : {
      order: OrderCustomerLocation
  } = req.body;
  
  const now = new Date();

  if (!order) {
      res.status(400).send("Empty body")
  }


  const transaction = await prisma.transaction.create({
    data: {
      amount: parseFloat(((order.sku.price * order.quantity) * 1.07).toFixed(2)),
      companyId: order.companyId,
      createdAt: now,
      userId: order.userId,
    },
  });

  
    await prisma.order.create({
        data: {
            amount: order.amount,
            companyId: order.companyId,
            createdAt: now,
            locationId: order.locationId,
            quantity: order.quantity,
            skuId: order.sku.id,
            transactionId: transaction.id,
            userId: order.userId
        }
    })
  res.status(200).send();
}

export default repeat;
