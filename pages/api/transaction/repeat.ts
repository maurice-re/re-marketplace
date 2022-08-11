import type { Request, Response } from "express";
import prisma from "../../../constants/prisma";
import { TransactionCustomerOrders } from "../../../utils/dashboard/dashboardUtils";


async function repeat(req: Request, res: Response) {
  const {
    transaction
  } : {
      transaction: TransactionCustomerOrders
  } = req.body;
  
  const now = new Date();

  if (!transaction) {
      res.status(400).send("Empty body")
  }


  const newTransaction = await prisma.transaction.create({
    data: {
      amount: transaction.amount,
      companyId: transaction.companyId,
      createdAt: now,
      userId: transaction.userId,
    },
  });

  
  transaction.orders.forEach( async (order) => {
      await prisma.order.create({
          data: {
              amount: order.amount,
              companyId: order.companyId,
              createdAt: now,
              locationId: order.locationId,
              quantity: order.quantity,
              skuId: order.sku.id,
              transactionId: newTransaction.id,
              userId: order.userId
          }
      })
  })
  console.log('done')
  res.status(200).send();
}

export default repeat;
