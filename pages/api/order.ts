import { Order, OrderItem, Product, Sku, Status } from "@prisma/client";
import type { Request, Response } from "express";
import prisma from "../../constants/prisma";
import { orderNanoid } from "../../utils/apiUtils";
import { getOrderStringTotal } from "../../utils/dashboard/orderStringUtils";
import { calculatePriceFromCatalog } from "../../utils/prisma/dbUtils";

async function handler(req: Request, res: Response) {
    const { orderString, products, skus, userId, paymentId }: { orderString: string, products: Product[], skus: Sku[], userId: string, paymentId: string; } = req.body;
    const now = new Date();
    if (req.method == "POST") {
        const orderItems: OrderItem[] = [];
        const orders: Order[] = [];
        orderString.split("*").forEach(ordersByLocation => {
            const orderId = orderNanoid();
            orders.push({
                id: orderId,
                amount: getOrderStringTotal(orderString, products, skus, 1.07),
                createdAt: now,
                locationId: ordersByLocation.split("_")[0],
                paymentId,
                status: Status.SUBMITTED,
                userId
            });
            ordersByLocation.split("_").slice(1).forEach((orderItem, index) => {
                const [skuId, quantity] = orderItem.split("~");
                orderItems.push({
                    id: `${orderId}-${index}`,
                    amount: calculatePriceFromCatalog(skus, skuId, quantity, 1.07),
                    orderId,
                    quantity: parseInt(quantity),
                    skuId,
                    comments: null,
                    createdAt: now,
                    qrCode: false,
                    receivedAt: null,
                    shippedAt: null,
                    status: Status.SUBMITTED
                })
            });
        });

        await prisma.$transaction([
            prisma.order.createMany({
                data: orders
            }),
            prisma.orderItem.createMany({
                data: orderItems
            })
        ])
        res.status(200).send({});
    }
}

export default handler;
