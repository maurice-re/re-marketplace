import type { Request, Response } from "express";
import prisma from "../../../constants/prisma";
import { OrderItemLocation } from "../../../utils/dashboard/dashboardUtils";
import { calculatePriceFromCatalog } from "../../../utils/prisma/dbUtils";


async function repeat(req: Request, res: Response) {
  const {
    orderItem,
    companyId,
    userId,
  }: {
    companyId: string;
    orderItem: OrderItemLocation;
    userId: string;
  } = req.body;

  const now = new Date();

  if (!orderItem || !companyId) {
    res.status(400).send("Empty body");
  }


  const order = await prisma.order.create({
    data: {
      amount: calculatePriceFromCatalog(orderItem.sku, orderItem.sku.id, orderItem.quantity, 1.07),
      companyId: companyId,
      createdAt: now,
      userId: userId
    },
  });


  await prisma.orderItem.create({
    data: {
      amount: orderItem.amount,
      comments: orderItem.comments,
      createdAt: now,
      locationId: orderItem.locationId,
      orderId: order.id,
      quantity: orderItem.quantity,
      qrCode: orderItem.qrCode,
      skuId: orderItem.sku.id,
    }
  });
  res.status(200).send();
}

export default repeat;
