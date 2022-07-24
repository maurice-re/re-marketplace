import { Role } from "@prisma/client";
import type { Request, Response } from "express";
import prisma from "../../../constants/prisma";
import { CartOrder } from "../../../context/form-context";
import { allLocations, calculateAmount, numItems, numLocations } from "../../../utils/prisma/cart";


async function createUser(req: Request, res: Response) {
  const {
    cart,
    form,
    customerId
  } : {
      cart: CartOrder[],
      form: string[],
      customerId: string
  } = req.body;
  
  const now = new Date();
  const tax = 1.07
  const shippingInfo = form.slice(4);

  if (!cart || !form) {
      res.status(200).send("Empty body")
  }

  const company = await prisma.company.create({
    data: {
      createdAt: now,
      name: form[3],
      customerId: customerId
    },
  });

  const user = await prisma.user.create({
    data: {
      companyId: company.id,
      createdAt: now,
      email: form[2],
      firstName: form[0],
      lastName: form[1],
      role: Role.ADMIN
    },
  });

  const transaction = await prisma.transaction.create({
    data: {
      amount: calculateAmount(cart, tax),
      companyId: company.id,
      createdAt: now,
      numItems: numItems(cart),
      numLocations: numLocations(cart),
      userId: user.id,
    },
  });

  let formIndex = 0;
  allLocations(cart).forEach(async (city) => {
    const location = await prisma.location.create({
      data: {
        city: shippingInfo[4 + 7 * formIndex],
        country: shippingInfo[1 + 7 * formIndex],
        companyId: company.id,
        lastOrderDate: now,
        line1: shippingInfo[2 + 7 * formIndex],
        line2: shippingInfo[3 + 7 * formIndex],
        numOrders: 1,
        shippingName: shippingInfo[0 + 7 * formIndex],
        state: shippingInfo[6 + 7 * formIndex],
        userId: user.id,
        zip: shippingInfo[5 + 7 * formIndex],
      },
    });
    cart.forEach( async (order) => {
      if(order.location == city) {
        await prisma.order.create({
            data: {
                amount: parseFloat((order.sku.price * order.quantity * tax).toFixed(2)),
                companyId: company.id,
                createdAt: now,
                locationId: location.id,
                quantity: order.quantity,
                skuId: order.sku.id,
                transactionId: transaction.id,
                userId: user.id
            }
        })
      }
    })
    formIndex += 1
  })
  res.status(200).send();
}

export default createUser;
