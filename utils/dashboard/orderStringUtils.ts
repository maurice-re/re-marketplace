import { OrderItem, Product, Sku } from "@prisma/client";
import { OrderWithItems } from "../../app/server-store";
import { calculatePriceFromCatalog } from "../prisma/dbUtils";

// ORDER STRING
//locationId _ skuId ~ quantity _ skuId ~ quantity * locationId...


export function getOrderStringTotal(orderString: string, products: Product[], skus: Sku[], tax?: number) {
    const ordersByLocation = orderString.split("*");
    const orders = ordersByLocation.reduce((_orders, orderByLoc) => _orders.concat(orderByLoc.split("_").slice(1)), [] as string[]);
    return orders.reduce((total, order) => {
      const [skuId, quantity] = order.split("~");
      return total + calculatePriceFromCatalog(skus, skuId, parseInt(quantity), tax)
    }, 0)
  }

export function getOrderString(order?: OrderWithItems, orderItem?: OrderItem, locationId?: string) {
    if (order) {
      return order.items.reduce((orderString, item) => {
          return orderString + `_${item.skuId}~${item.quantity}`
      }, order.locationId)
    } else if (orderItem && locationId) {
      return `${locationId}_${orderItem.skuId}~${orderItem.quantity}`
    }
    return "";
}