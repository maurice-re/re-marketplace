import { Product, Sku } from "@prisma/client";
import type { Request, Response } from "express";
import prisma from "../../constants/prisma";
import { getOrderStringTotal } from "../../utils/dashboard/orderStringUtils";
import { calculatePriceFromCatalog } from "../../utils/prisma/dbUtils";


async function handler(req: Request, res: Response) {
  const {orderString, companyId, products, skus, userId } : { orderString: string, companyId: string, products: Product[], skus: Sku[], userId: string } = req.body;
  const now = new Date();
  if (req.method == "POST") {
    const newOrder = await prisma.order.create({
        data: {
            amount: getOrderStringTotal(orderString, products, skus, 1.07),
            companyId: companyId,
            createdAt: now,
            userId: userId
        }
    })
    const orderItems: { amount: number; createdAt: Date; locationId: string; orderId: string, quantity: number; skuId: string; }[] = [];
    orderString.split("*").forEach(ordersByLocation => {
        const locationId = ordersByLocation.split("_")[0];
        const ordersForLocation = ordersByLocation.split("_").slice(1);
        ordersForLocation.forEach(order => {
            const [skuId, quantity] = order.split("~");
            orderItems.push({
                amount: calculatePriceFromCatalog(skus, skuId, quantity, 1.07),
                createdAt: now,
                locationId: locationId,
                orderId: newOrder.id,
                quantity: parseInt(quantity),
                skuId: skuId
            })
        })
    })

    await prisma.orderItem.createMany({
        data: orderItems
    })
    res.status(200).send({});
  }
}

export default handler;
