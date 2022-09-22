import { Product, Sku } from "@prisma/client";
import { calculatePriceFromCatalog } from "../prisma/dbUtils";

// ORDER STRING
//locationId _ skuId ~ quantity _ skuId ~ quantity * locationId...


export function getOrderStringTotal(orderString: string, skus: Sku[], products: Product[], tax?: number) {
    const ordersByLocation = orderString.split("*");
    const orders = ordersByLocation.reduce((_orders, orderByLoc) => _orders.concat(orderByLoc.split("_").slice(1)), [] as String[]);
    return orders.reduce((total, order) => {
      const [skuId, quantity] = order.split("~");
      return total + calculatePriceFromCatalog(skus, skuId, parseInt(quantity), tax)
    }, 0)
  }
