import { CartOrder } from "../../stores/formStore";
import { calculatePriceFromCatalog } from "../prisma/dbUtils";

export function numLocations(cart: CartOrder[]): number {
  let locations: string[] = [];
  cart.forEach((order) => {
    if (!locations.includes(order.location)) {
      locations.push(order.location);
    }
  });
  return locations.length;
}

export function allLocations(cart: CartOrder[]): string[] {
  let locations: string[] = [];
  cart.forEach((order) => {
    if (!locations.includes(order.location)) {
      locations.push(order.location);
    }
  });
  return locations;
}

export function numItems(cart: CartOrder[]): number {
  return cart.reduce((total, o) => total + o.quantity, 0);
}

export function calculateAmount(cart: CartOrder[], tax: number): number {
  return cart.reduce(
    (total, cartOrder) =>
      total +
      calculatePriceFromCatalog(
        cartOrder.sku,
        cartOrder.sku.id,
        cartOrder.quantity,
        tax
      ),
    0
  );
}
