import { OrderItem, Product, Sku } from "@prisma/client";
import { calculatePriceFromCatalog } from "../prisma/dbUtils";
import { OrderWithItems, separateByLocationId } from "./dashboardUtils";

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

export function getOrderString(order?: OrderWithItems, orderItem?: OrderItem) {
    if (order) {
      const orderItemsByLocation = separateByLocationId(order.items);
      return orderItemsByLocation.reduce((orderString, itemsByLocation) => {
        const items = itemsByLocation.reduce((itemString, item) => {
          return itemString + `_${item.skuId}~${item.quantity}`
        }, "")
        return orderString + (orderString == "" ? "" : "*") +`${itemsByLocation[0].locationId}${items}`
      }, "")
    }
    if (orderItem) {
      return `${orderItem.locationId}_${orderItem.skuId}~${orderItem.quantity}`
    }
    return "";
}