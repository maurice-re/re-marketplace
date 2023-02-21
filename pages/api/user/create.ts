import { LocationType } from "@prisma/client";
import type { Request, Response } from "express";
import { prisma } from "../../../constants/prisma";
import { CartOrder } from "../../../stores/formStore";
import { allLocations, calculateAmount } from "../../../utils/form/cart";
import { calculatePriceFromCatalog } from "../../../utils/prisma/dbUtils";


async function create(req: Request, res: Response) {
  const {
    cart,
    form,
    customerId
  }: {
    cart: CartOrder[],
    form: string[],
    customerId: string;
  } = req.body;

  const now = new Date();
  const tax = 1.07;
  const shippingInfo = form.slice(4);

  if (!cart || !form) {
    res.status(200).send("Empty body");
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
    },
  });

  const order = await prisma.order.create({
    data: {
      amount: calculateAmount(cart, tax),
      createdAt: now,
      userId: user.id,
      paymentId: customerId,
      // TODO(Suhana): Add locationId here
    },
  });

  let formIndex = 0;
  allLocations(cart).forEach(async (city) => {
    await prisma.location.create({
      data: {
        city: shippingInfo[4 + 7 * formIndex],
        country: shippingInfo[1 + 7 * formIndex],
        line1: shippingInfo[2 + 7 * formIndex],
        line2: shippingInfo[3 + 7 * formIndex],
        shippingName: shippingInfo[0 + 7 * formIndex],
        state: shippingInfo[6 + 7 * formIndex],
        zip: shippingInfo[5 + 7 * formIndex],
        type: LocationType.SHIPPING,
      },
    });
    cart.forEach(async (orderItem) => {
      if (orderItem.location == city) {
        await prisma.orderItem.create({
          data: {
            amount: calculatePriceFromCatalog(orderItem.sku, orderItem.sku.id, orderItem.quantity, tax),
            createdAt: now,
            orderId: order.id,
            quantity: orderItem.quantity,
            skuId: orderItem.sku.id,
          }
        });
      }
    });
    formIndex += 1;
  });
  res.status(200).send();
}

export default create;
