import { CartOrder } from "../../context/form-context";

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
  return parseFloat(
    (
      cart.reduce(
        (total, order) => total + order.sku.price * order.quantity,
        0
      ) * tax
    ).toFixed(2)
  );
}
