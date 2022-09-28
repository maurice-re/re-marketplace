import { Sku } from "@prisma/client";

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

export function calculatePriceFromCatalog(skus: Sku | Sku[], id: string, _quantity: number | string, tax?: number): number {
  const quantity: number =  typeof _quantity == "string" ? parseInt(_quantity) : _quantity;

  const sku = Array.isArray(skus) ? skus.find((sku) => sku.id == id)! : skus;
  const price = getPriceFromTable(sku.priceTable, quantity);
    if (tax) {
      return parseFloat((price * quantity * tax).toFixed(2));
    }
    return parseFloat((price * quantity).toFixed(2));
}
