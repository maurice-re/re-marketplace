import { Sku } from "@prisma/client";
import { ItemLocationSku, OrderWithItemsLocationSku } from "../dashboard/dashboardUtils";

export function getPriceFromTable(_priceTable: string, _quantity: number | string): number {
  const quantity: number = typeof _quantity == "string" ? parseInt(_quantity) : _quantity
    const priceTable = _priceTable.split(", ");
      const [moq, price] = priceTable[0].split(":");
      if (quantity >= parseInt(moq)){
          return parseFloat(price)
      } else {
          return getPriceFromTable(priceTable.splice(1).join(", "), quantity)
      }
}
