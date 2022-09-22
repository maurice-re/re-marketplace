import { Product, Sku } from "@prisma/client";
import type { Request, Response } from "express";
import prisma from "../../constants/prisma";
import { getOrderStringTotal } from "../../utils/dashboard/orderStringUtils";
import { calculatePriceFromCatalog } from "../../utils/prisma/dbUtils";


async function handler(req: Request, res: Response) {
  const {orderString, companyId, products, skus, userId } : { orderString: string, companyId: string, products: Product[], skus: Sku[], userId: string } = req.body;
  const now = new Date();
  if (req.method == "POST") {
    const newTransaction = await prisma.transaction.create({
        data: {
            amount: getOrderStringTotal(orderString, skus, products, 1.07),
            companyId: companyId,
            createdAt: now,
            userId: userId
        }
    })
    const orders: { amount: number; companyId: string; createdAt: Date; locationId: string; quantity: number; skuId: string; transactionId: string; userId: string; }[] = [];
    orderString.split("*").forEach(ordersByLocation => {
        const locationId = ordersByLocation.split("_")[0];
        console.log(locationId);
        const ordersForLocation = ordersByLocation.split("_").slice(1);
        ordersForLocation.forEach(order => {
            const [skuId, quantity] = order.split("~");
            orders.push({
                amount: calculatePriceFromCatalog(skus, products, skuId, quantity, 1.07),
                companyId: companyId,
                createdAt: now,
                locationId: locationId,
                quantity: parseInt(quantity),
                skuId: skuId,
                transactionId: newTransaction.id,
                userId: userId
            })
        })
    })

    await prisma.order.createMany({
        data: orders
    })
    res.status(200).send({});
  }
}

export default handler;
