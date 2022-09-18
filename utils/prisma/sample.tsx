import { calculatePriceFromCatalog } from "./dbUtils";
import { Order } from "@prisma/client";

export function allLocations(cart: Order[]): string[] {
  let locations: string[] = [];
  cart.forEach((order) => {
    if (!locations.includes(order.location)) {
      locations.push(order.location);
    }
  });
  return locations;
}

export function calculateAmount(orders: Order[], tax: number): number {
  return orders.reduce(
    (total, cartOrder) =>
      total +
      calculatePriceFromCatalog(
        cartOrder.sku,
        cartOrder.product,
        cartOrder.sku.id,
        cartOrder.quantity,
        tax
      ),
    0
  );
}
