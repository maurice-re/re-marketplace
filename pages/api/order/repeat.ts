import type { Request, Response } from "express";
import prisma from "../../../constants/prisma";
import { OrderCustomerOrderItems } from "../../../utils/dashboard/dashboardUtils";


async function repeat(req: Request, res: Response) {
  const {
    order,
  }: {
    order: OrderCustomerOrderItems;
  } = req.body;

  const now = new Date();

  if (!order) {
    res.status(400).send("Empty body");
  }


  const newOrder = await prisma.order.create({
    data: {
      amount: order.amount,
      companyId: order.companyId,
      createdAt: now,
      userId: order.userId,
      paymentId: order.paymentId,
    },
  });

  const orderItems = order.orderItems.map(item => {
    return {
      amount: item.amount,
      comments: item.comments,
      createdAt: now,
      locationId: item.locationId,
      orderId: newOrder.id,
      quantity: item.quantity,
      qrCode: item.qrCode,
      skuId: item.sku.id,
    };
  });

  await prisma.orderItem.createMany({
    data: orderItems
  });

  res.status(200).send();
}

export default repeat;
